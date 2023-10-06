import { DAYS_OF_WEEK, TIME_ZONES } from "./config";

export function extractValues(data: { [x: string]: any }) {
	const valList = [];
	for (let x in data) {
		const newVal = {
			code: x,
			...data[x],
		};
		valList.push(newVal);
	}
	return valList;
}

export async function fetchGeolocation() {
	let geo = await fetch("https://geolocation-db.com/json/")
		.then((resp) => resp.json())
		.catch((error) => console.log(error));
	let timezone;
	if (geo !== null) {
		let countryZones = TIME_ZONES.filter(
			(x) => x.countryCode === geo.country_code
		);
		if (countryZones.length > 0) {
			let cityZones = countryZones.filter(
				(x) => x.mainCities.indexOf(geo.city) !== -1
			);
			timezone =
				cityZones.length > 0 ? cityZones[0].name : countryZones[0].name;
		} else {
			timezone = null;
		}
		return {
			country: geo.country_name,
			timezone: timezone,
		};
	}
}

export function getDisplayOptions(array: any[], key: string | number) {
	return array.map((x) => x[key]);
}

export function findByName(array: any[], key: string | number, value: any) {
	// find array element with key=value
	const filtered = array.filter((x) => {
		return x[key] === value;
	});
	return filtered.length > 0 ? filtered[0] : null;
}

export function toDaysObject(total: any, name: string) {
	name = name.toLowerCase().substring(0, 3);
	return {
		[name]: "V",
		...total,
	};
}

export function toTimeObject(total: any, curVal: string) {
	let key = curVal.replace(":", "");
	return {
		[key]: curVal,
		...total,
	};
}

export function filterTimeZones(countryCode: any) {
	const zones = TIME_ZONES.filter((x: { countryName: any }) => {
		return x.countryName === countryCode;
	});
	return zones.length > 0 ? zones : TIME_ZONES;
}

export async function sendAppOpen(user: { id: { toString: () => any } }) {
	let payload = JSON.stringify({
		platform: "tg",
		users: [user.id.toString()],
	});
	fetch(import.meta.env.VITE_WEBHOOK_OPEN, {
		method: "POST",
		body: payload,
		headers: {
			"Content-type": "application/json",
		},
	})
		.then((resp) => resp.json())
		.catch((error) => console.log(error));
}

export function parseUrlDays(days: string) {
	let selected: string[] = days.split(",").filter((x) => x.trim() !== "");
	if (selected.length > 0) {
		let daysOfWeek = DAYS_OF_WEEK.map((x) => x.toLowerCase().substring(0, 3));
        selected = selected.map((x) => {
            let index = daysOfWeek.indexOf(x);
            return index !== -1 ? DAYS_OF_WEEK[index] : [];
        }) as string[];
		return selected;
	} else {
		return [];
	}
}

export function parseUrlTimes(times: string) {
	return times.split(",").filter((x) => x.trim() !== "");
}
