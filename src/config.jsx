import {extractValues} from "./utils.jsx";
import {countries, languages} from "countries-list";
import {getTimeZones} from "@vvo/tzdb";

export const WEBHOOK_URL = "https://functions.yandexcloud.net/d4ecji0mcnh76oq29hs3";
export const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];
export const TIME_LIST = [
    "6:00",
    "6:30",
    "7:00",
    "7:30",
    "8:00",
    "8:30",
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
];
export const COUNTRIES = extractValues(countries);
export const TIME_ZONES = getTimeZones();
export const LANGS = extractValues(languages);
export const LANG_DISPLAY = "native";
export const TG_MAIN_BUTTON = false;
export const LANG_ON = false;