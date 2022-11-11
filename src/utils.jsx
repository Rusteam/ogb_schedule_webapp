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

export function genListHooks(array) {
    let timeList = [];
    for (let i = 0; i < array.length; i++) {
        let [one, updateOne] = useState(false);
        timeList.push([array[i], one, updateOne]);
    }
    return timeList;
}

export function sumListHooks(total, hookElem) {
    // find a number of 'true' states
    return total + hookElem[1];
}

export function findByName(array, key, value) {
    // find array element with key=value
    const filtered = array.filter((x) => {
        return x[key] === value;
    });
    return filtered.length > 0 ? filtered[0] : null;
}

export function toDaysObject(total, curVal) {
    let [name, isSelected] = curVal;
    if (isSelected) {
        name = name.toLowerCase().substring(0, 3);
        return {
            [name]: "V",
            ...total,
        };
    } else {
        return total
    }
}

export function toTimeObject(total, curVal) {
    let [name, isSelected] = curVal;
    if (isSelected) {
        let key = name.replace(":", "");
        return {
            [key]: name,
            ...total,
        };
    } else {
        return total
    }
}