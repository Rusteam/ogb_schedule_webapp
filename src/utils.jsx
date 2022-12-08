import {useState} from "react";
import {TIME_ZONES} from "./config.jsx";

export function extractValues(data) {
    let valList = [];
    for (let x in data) {
        let newVal = {
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
        let countryZones = TIME_ZONES.filter((x) => x.countryCode === geo.country_code);
        if (countryZones.length > 0) {
            let cityZones = countryZones.filter((x) => x.mainCities.indexOf(geo.city) !== -1 );
            timezone = cityZones.length > 0 ? cityZones[0].name : countryZones[0].name;
        } else {
            timezone = null;
        }
        return {
            "country": geo.country_name,
            "timezone": timezone
        }
    }
}

export function getDisplayOptions(array, key) {
    return array.map((x) => x[key]);
}

export function findByName(array, key, value) {
    // find array element with key=value
    const filtered = array.filter((x) => {
        return x[key] === value;
    });
    return filtered.length > 0 ? filtered[0] : null;
}

export function toDaysObject(total, name) {
    name = name.toLowerCase().substring(0, 3);
    return {
        [name]: "V",
        ...total,
    };

}

export function toTimeObject(total, curVal) {
    let key = curVal.replace(":", "");
    return {
        [key]: curVal,
        ...total,
    };
}