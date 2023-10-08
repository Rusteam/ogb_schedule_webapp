import { useEffect, useState } from "react";
import "./App.css";
import {  Language, languages } from "countries-list";
import {
	fetchGeolocation,
	filterTimeZones,
	findByName,
	parseUrlDays,
	parseUrlTimes,
	sendAppOpen,
	toDaysObject,
	toTimeObject,
} from "./utils"
import {
	COUNTRIES,
	LANG_DISPLAY,
	LANG_ON,
	LANGS,
	TG_MAIN_BUTTON,
	TIME_ZONES,
} from "./config";
import { DropdownSelect, MainDuplicate, TimeList, Week } from "./components";

declare global {
  interface Window {
    Telegram: {WebApp: any};
  }
}

interface User{
  language_code: string;
  id: string;
  first_name: string;
}
function App() {
	const tg = window.Telegram.WebApp;
	const user:User = tg.initDataUnsafe.user ?? {
		language_code: "en",
		id: "1234",
		first_name: "John Doe",
	};
	tg.expand();

	// read url params if passed
	const searchParams = new URLSearchParams(window.location.search);
	let urlDays = parseUrlDays(searchParams.get("days") ?? "");
	let urlTimes = parseUrlTimes(searchParams.get("time") ?? "");
	console.log(urlDays, urlTimes);

	// set hooks
	const [dayList, updateDayList] = useState<string[]>(urlDays);
	const [timeList, updateTimeList] = useState<string[]>(urlTimes);
	const [country, setCountry] = useState<string>();
	const [timeZone, setTimeZone] = useState<string>();
	const [lang, setLang] = useState<string>();
	let zones = filterTimeZones(country);

const handleGeoChange = async () => {
  const GEO = await fetchGeolocation();
  if (GEO) {
    setCountry(GEO.country ? GEO.country : undefined);
    GEO.timezone && setTimeZone(GEO.timezone);
    if (LANG_ON) {
      setLang(
        user?.language_code
          ? (languages as {[key: string]: Language})[user.language_code][LANG_DISPLAY]
          : undefined
      );
    }
  }
};

	useEffect(() => {
		handleGeoChange();
	}, []);

	useEffect(() => {
		sendAppOpen(user);
	}, []);

	useEffect(() => {
		if (country) {
			zones = filterTimeZones(country);
			setTimeZone(zones[0].name);
		}
	}, [country]);

	const submitData = async () => {
		console.log("submit clicked");
		let selectedDays = dayList.reduce(toDaysObject, {});

		let selectedTime = timeList.reduce(toTimeObject, {});
		let timeOffset = timeZone
			? Math.round(
					findByName(TIME_ZONES, "name", timeZone)?.rawOffsetInMinutes / 60
			  )
			: null;
timeOffset = timeZone
  ? Math.round(
      findByName(TIME_ZONES, "name", timeZone)?.rawOffsetInMinutes / 60
    )
  : null;
			timeOffset === null
				? null
				: timeOffset >= 0
				? `+${timeOffset}`
				: timeOffset.toString();
		let data = {
			country: country,
			timezone: timeOffset,
			...selectedDays,
			...selectedTime,
		};
		if (LANG_ON) {
			data["language"] = lang
				? findByName(LANGS, LANG_DISPLAY, lang)?.code
				: null;
		}

		const payload = JSON.stringify({
			platform: "tg",
			users: [user.id.toString()],
			data,
		});
		console.log({ payload });

		const resp = await fetch(import.meta.env.VITE_WEBHOOK_SAVE, {
			method: "POST",
			body: payload,
			headers: {
				"Content-type": "application/json",
			},
		});

		tg.close();

		const json = await resp.text();

		console.log(json);
	};

	if (TG_MAIN_BUTTON) {
		// Can't use this at the moment because submitData is called multiple times
		// with different state
		tg.MainButton.onClick(submitData);
		tg.MainButton.setText("Submit");
		tg.MainButton.show();
	} else {
		tg.MainButton.hide();
	}

	return (
		<div className="artboard cnt-text" style={{ width: "320px" }}>
			<h2>Hello, {user ? user.first_name : "user"}!</h2>
			<h3 className="text-xl">Set your training schedule</h3>
			<div className="divider"></div>
			<Week selectedDays={dayList} updateDays={updateDayList}></Week>
			<div className="divider"></div>
			<TimeList
				selectedTimes={timeList}
				updateTimes={updateTimeList}
			></TimeList>
			<div className="divider"></div>
			<div>
				<h5 className="text-base-content">Location settings:</h5>
				<DropdownSelect
					name="country"
					values={COUNTRIES}
					displayKey="name"
					updateSelected={setCountry}
					selected={country}
				></DropdownSelect>
				<DropdownSelect
					name="time zone"
					values={zones}
					displayKey="name"
					updateSelected={setTimeZone}
					selected={timeZone}
				></DropdownSelect>
				{LANG_ON ? (
					<DropdownSelect
						name="language"
						values={LANGS}
						displayKey={LANG_DISPLAY}
						updateSelected={setLang}
						selected={lang}
					></DropdownSelect>
				) : (
					<div></div>
				)}
				<MainDuplicate
					disabled={TG_MAIN_BUTTON}
					submitData={submitData}
					active={true}
				></MainDuplicate>
			</div>
		</div>
	);
}

export default App;
