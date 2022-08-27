import {useEffect, useState} from 'react'
import './App.css'
import {countries, languages} from "countries-list";
import {getTimeZones} from "@vvo/tzdb";

const WEBHOOK_URL = "https://app.botmother.com/api/bot/action/Q7diqBbn6/CXCtDuDiYXDWCnDwCxBaDd8XB3BTDkd8B0CaBovDAChBbBdB5C0BuDKIXC3D5CAB";
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const TIME_LIST = [
    "7:00", "7:30", "8:00", "8:30",
    "9:00", "9:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30"
];

function extractValues(data) {
  let valList = [];
  for (let x in data) {
    let newVal = {
      code: x,
      ...data[x]
    }
    valList.push(newVal);
  }
  return valList;
}

async function fetchGeolocation() {
    return fetch("http://ip-api.com/json")
          .then(resp => resp.json())
          .catch(error => console.log(error));
    }

const COUNTRIES = extractValues(countries);
const TIME_ZONES = getTimeZones();
const LANGS = extractValues(languages);
const LANG_DISPLAY = "native";
const GEO = fetchGeolocation();

function getDisplayOptions(array, key) {
  return array.map((x) => x[key]);
}

function genListHooks(array) {
  let timeList = [];
  for (let i = 0; i < array.length; i++) {
        let [one, updateOne] = useState(false);
        timeList.push([array[i], one, updateOne])
  }
  return timeList;
}

function sumListHooks(total, hookElem) {
    // find a number of 'true' states
    return total + hookElem[1];
}

function findByName(array, key, value) {
    // find array element with key=value
    const filtered = array.filter((x) => {return x[key] === value});
    return filtered.length > 0 ? filtered[0] : null;
}

function DayOfWeek(props) {
  let style = {
    "marginBottom": "1px"
  }
  let outlineClass = props.isSelected ? "btn-accent" : "btn-ghost";

  const toggleButton = () => {
    let val = !props.isSelected;
    props.updateSelected(val);
  }

  let name = props.name.substring(0, 1).toUpperCase() + props.name.substring(1, 2).toLowerCase()

  return (
    <div id={`week-${props.name}`}>
      <button
          className={`btn btn-sm btn-circle btn-active ${outlineClass}`}
          style={style}
          onClick={toggleButton}
      >{name}</button>
    </div>
  );
}

const Week = (props) => {

  const renderDay = (time) => {
    let [name, isSelected, updateSelected] = time;
    return <DayOfWeek
        name={name}
        isSelected={isSelected}
        updateSelected={updateSelected}
    ></DayOfWeek>;
  }

  return (
    <div>
        <div className="one-line">
          {props.days.map(renderDay)}
        </div>
    </div>
  );
};

const TimeOfDay = (props) => {

  const [time, isSelected, updateSelected] = props.time;

  const toggleButton = () => {
    let val = !isSelected;
    updateSelected(val);
  }

  const activeClass = isSelected ? "btn-primary" : "btn-ghost";

  return (
        <span id={`time-${time}`}>
          <button className={`btn-space btn btn-sm ${activeClass}`} onClick={toggleButton}>
            {time}
          </button>
        </span>
    );
};

const TimeList = (props) => {
  // const [newInput, setNewInput] = useState("");

  function showTime(time) {
    return <TimeOfDay time={time}></TimeOfDay>;
  }

  function handleNewInput(event) {
    // TODO handle delete correctly

    let val = event.target.value;
    let last_char = Number.parseInt(val.charAt(val.length - 1));

    if (!Number.isNaN(last_char)) {
      switch (val.length) {
        case 1:
          var new_val = last_char > 2 ? val + ":" : val;
          setNewInput(new_val);
          break;
        case 2:
          var full_int = Number.parseInt(val);
          var new_val = full_int > 23 ? val.slice(0, -1) : val + ":";
          setNewInput(new_val);
          break;
        case 3:
        case 4:
          if (last_char === 3 || last_char === 0) {
            props.timeList.push(val + "0");
            props.setTimeList(props.timeList);
            setNewInput("");
          } else {
            var new_val = val.slice(0, -1);
            setNewInput(new_val);
          }
          break;
      }
    }
  }

  return (
        <div className="time-list">
          {props.timeList.map(showTime)}
          {/*<input*/}
          {/*  className="input input-sm input-bordered input-accent"*/}
          {/*  type="text"*/}
          {/*  name="time-enter"*/}
          {/*  size="3"*/}
          {/*  minLength="5"*/}
          {/*  maxLength="5"*/}
          {/*  placeholder="21:00"*/}
          {/*  onChange={handleNewInput}*/}
          {/*  value={newInput}*/}
          {/*/>*/}
        </div>
    );
};

function DropdownSelect(props) {
  const options = getDisplayOptions(props.values, props.displayKey);

  function renderOption(value) {
      return (
          <option
              value={value}
              key={props.name + '-' + value}
          >{value}</option>
      );
  }

  function setSelected(event) {
    props.updateSelected(event.target.value)
  }

  return (
      <div className="one-line">
        <select
            name={props.name}
            onChange={setSelected}
            className="select select-ghost w-full max-w-xs"
            style={{textAlign: "center", marginBottom: "1px"}}
            value={props.selected ? props.selected : props.name}
        >
          <option disabled>{props.name}</option>
          {options.map(renderOption)}
        </select>
      </div>
    );
}

function toObject(total, curVal) {
  let [name, isSelected] = curVal;
  return {
    [name]: isSelected,
    ...total,
  };
}

function filterTimeZones(countryCode) {
  const zones = TIME_ZONES.filter((x) => {return x.countryName === countryCode});
  return zones.length > 0 ? zones : TIME_ZONES;
}

function App() {

  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe.user;
  tg.expand();

  // set hooks
  const timeList = genListHooks(TIME_LIST);
  const dayList = genListHooks(DAYS_OF_WEEK);
  const [country, setCountry] = useState(GEO.country ? GEO.country : null);
  const [timeZone, setTimeZone] = useState(GEO.timezone ? GEO.timezone : null);
  const [lang, setLang] = useState(user?.language_code ? languages[user.language_code][LANG_DISPLAY] : null);


  const submitData = async () => {
    console.log("submit clicked");
    let selectedDays = dayList.reduce(toObject, {});
    let selectedTime = timeList.reduce(toObject, {});
    let timeOffset = timeZone ? findByName(TIME_ZONES, "name", timeZone)?.rawOffsetInMinutes / 60: null;
    let lang_code = lang ? findByName(LANGS, LANG_DISPLAY, lang)?.code : null;
    let data = {
      time: selectedTime,
      days: selectedDays,
      country: country,
      time_offset: timeOffset,
      lang_code: lang_code
    };

    const resp = await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "content-type": "application/json; charset=UTF-8"
      },
      body: {
        data: data,
        platform: "tg",
        users: [user.id.toString()]
      }
    })

      console.log(resp);

    tg.close()
  }

  tg.MainButton.onClick(submitData);
  tg.MainButton.setText("Submit");
  tg.MainButton.show();

  if (timeList.reduce(sumListHooks, 0) > 0 && dayList.reduce(sumListHooks, 0)) {
      tg.MainButton.enable();
    } else {
      tg.MainButton.disable();
  }

  return (
     <div className="artboard phone-1 cnt-text">
       <h2>Hello, {user ? user.first_name : "user"}!</h2>
      <h3 className="text-xl">Set your training schedule</h3>
       <div className="divider"></div>
      <Week
          days={dayList}
      ></Week>
       <div className="divider"></div>
       <TimeList
        timeList={timeList}
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
          values={filterTimeZones(country)}
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
      </div>
    </div>
  )
}

export default App
