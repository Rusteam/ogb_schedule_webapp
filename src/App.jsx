import {useEffect, useState} from "react";
import "./App.css";
import {languages} from "countries-list";
import {fetchGeolocation, findByName, genListHooks, sumListHooks, toDaysObject, toTimeObject} from "./utils.jsx";
import {COUNTRIES, DAYS_OF_WEEK, LANG_DISPLAY, LANGS, TIME_LIST, TIME_ZONES, WEBHOOK_URL, TG_MAIN_BUTTON} from "./config.jsx";
import {DropdownSelect, MainDuplicate, TimeList, Week} from "./Components.jsx";

function filterTimeZones(countryCode) {
	const zones = TIME_ZONES.filter((x) => {
		return x.countryName === countryCode;
	});
	return zones.length > 0 ? zones : TIME_ZONES;
}

function App() {
	const tg = window.Telegram.WebApp;
	const user = tg.initDataUnsafe.user ?? {
		language_code: "en",
		id: "all",
		first_name: "John Doe",
	};
	tg.expand();

	// set hooks
	const timeList = genListHooks(TIME_LIST);
	const dayList = genListHooks(DAYS_OF_WEEK);
	const [country, setCountry] = useState("");
	const [timeZone, setTimeZone] = useState("");
	const [lang, setLang] = useState("");
	let zones = filterTimeZones(country);

	const handleGeoChange = async () => {
		const GEO = await fetchGeolocation();
		setCountry(GEO.country ? GEO.country : null);
		setTimeZone(GEO.timezone ? GEO.timezone : null);
		setLang(
			user?.language_code ? languages[user.language_code][LANG_DISPLAY] : null
		);
	};

	useEffect(() => {
		handleGeoChange();
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
			? Math.round(findByName(TIME_ZONES, "name", timeZone)?.rawOffsetInMinutes / 60)
			: null;
		timeOffset = timeOffset === null ? null : (timeOffset >= 0 ? `+${timeOffset}` : timeOffset.toString());
		let langCode = lang ? findByName(LANGS, LANG_DISPLAY, lang)?.code : null;
		let data = {
			country: country,
			timezone: timeOffset,
			language: langCode,
			...selectedDays,
			...selectedTime,
		};

		const payload = JSON.stringify({
			platform: "tg",
			users: [user.id.toString()],
			data,
		});
		console.log({ payload });

		const resp = await fetch(WEBHOOK_URL, {
			method: "POST",
			body: payload,
			headers: {
				"Content-type": "application/json"
			}
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
		<div className="artboard phone-1 cnt-text">
			<h2>Hello, {user ? user.first_name : "user"}!</h2>
			<h3 className="text-xl">Set your training schedule</h3>
			<div className="divider"></div>
			<Week days={dayList}></Week>
			<div className="divider"></div>
			<TimeList timeList={timeList}></TimeList>
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
				<DropdownSelect
					name="language"
					values={LANGS}
					displayKey={LANG_DISPLAY}
					updateSelected={setLang}
					selected={lang}
				></DropdownSelect>
				<MainDuplicate
					disabled={TG_MAIN_BUTTON}
					submitData={submitData}
					active={timeList.reduce(sumListHooks, 0) > 0 && dayList.reduce(sumListHooks, 0) > 0}
				></MainDuplicate>
			</div>
		</div>
	);
}

export default App;
