import { useState } from 'react'
import './App.css'

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const TIME_LIST = [
    "7:00", "8:00", "9:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00"
];
const COUNTRIES = ["India", "UAE", "Russia", "Pakistan"]
const TIME_ZONES = [
  {
    zone: "UK (0)",
    diff: 0
  },
  {
    zone: "Europe (+1)",
    diff: 1
  },
  {
    zone: "Russia (+3)",
    diff: 3
  },
  {
    zone: "India (+6)",
    diff: 6
  }
];
const LANGS = [
  {
    lang: "English",
    code: "en"
  },
  {
    lang: "Russian",
    code: "ru"
  },
  {
    lang: "Spanish",
    code: "es"
  },
  {
    lang: "Chinese (Mandarin)",
    code: "cn"
  },
  {
    lang: "Arabic",
    code: "ar"
  }
];

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
    <div>
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

  const renderTimeButton = () => {
    return (
        <span>
          <button className={`btn-space btn btn-sm ${activeClass}`} onClick={toggleButton}>
            {time}
          </button>
        </span>
    )
  }

  return renderTimeButton();
};

const TimeList = (props) => {
  // const [newInput, setNewInput] = useState("");

  function showTime(time) {
    return <TimeOfDay time={time}></TimeOfDay>;
  }

  function renderTimes() {
    return (
      <div>
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
      </div>
    );
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

  return renderTimes();
};

function DropdownSelect(props) {
  const options = getDisplayOptions(props.values, props.displayKey);

  function renderOption(value) {
    return <option value={value}>{value}</option>;
  }

  function setSelected(event) {
    props.updateSelected(event.target.value)
  }

  function renderSelect() {
    return (
      <div className="one-line">
        <select
            name={props.name}
            onChange={setSelected}
            className="select select-ghost w-full max-w-xs"
            style={{textAlign: "center", marginBottom: "1px"}}
        >
          <option disabled selected>{props.name}</option>
          {options.map(renderOption)}
        </select>
      </div>
    );
  }

  return renderSelect();
}


function toObject(total, curVal) {
  let [name, isSelected] = curVal;
  return {
    [name]: isSelected,
    ...total,
  };
}


function App() {

  // set hooks
  const timeList = genListHooks(TIME_LIST);
  const dayList = genListHooks(DAYS_OF_WEEK);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [timeZone, setTimeZone] = useState(TIME_ZONES[0].diff);
  const [lang, setLang] = useState(LANGS[0].code);

  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe.user;

  tg.expand();

  const submitData = async () => {
    console.log("submit clicked");
    let selectedDays = dayList.reduce(toObject, {});
    let selectedTime = timeList.reduce(toObject, {});
    let data = {
      time: selectedTime,
      days: selectedDays,
      country: country,
      timeZone: timeZone,
      langCode: lang
    };

    const url = "https://app.botmother.com/api/bot/action/Q7diqBbn6/CXCtDuDiYXDWCnDwCxBaDd8XB3BTDkd8B0CaBovDAChBbBdB5C0BuDKIXC3D5CAB";
    const params = {
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
    };

    // const resp = await fetch(url, params)
    // if (resp.ok) {
    //   console.log("Success:", resp.json())
    // } else {
    //   console.log("Error:", resp.status)
    // }
    await fetch(url, params)
        .then(resp => resp.json())
        .then(data => {console.log("Success: ", data)})
        .catch(error => {console.log("Error: ", error)} )

    tg.close();
  }

  const countryMap = (x) => {
    return {"country": x}
  }

  tg.MainButton.onClick(submitData);
  tg.MainButton.setText("Submit");
  tg.MainButton.show();

  return (
     <div className="artboard phone-1">
       <h2>Hello, {user ? user.first_name : "user"}!</h2>
      <h3>Set your training schedule:</h3>
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
        <h5 className="text-base-content">Time and language:</h5>
        <DropdownSelect
          name="country"
          values={COUNTRIES.map(countryMap)}
          displayKey="country"
          updateSelected={setCountry}
          ></DropdownSelect>
        <DropdownSelect
          name="time zone"
          values={TIME_ZONES}
          displayKey="zone"
          updateSelected={setTimeZone}
        ></DropdownSelect>
        <DropdownSelect
          name="language"
          values={LANGS}
          displayKey="lang"
          updateSelected={setLang}
        ></DropdownSelect>
      </div>
    </div>
  )
}

export default App
