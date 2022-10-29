import {useState} from "react";

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
    return await fetch("http://ip-api.com/json")
        .then((resp) => resp.json())
        .catch((error) => console.log(error));
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