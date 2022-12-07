import {getDisplayOptions} from "./utils.jsx";
import {DAYS_OF_WEEK} from "./config.jsx";

export function DayOfWeek(props) {
    let style = {
        marginBottom: "1px",
    };
	let isSelected = props.selectedItems.indexOf(props.name) !== -1;
    let outlineClass = isSelected ? "btn-accent" : "btn-ghost";

    const toggleButton = () => {
		isSelected = props.selectedItems.indexOf(props.name) !== -1;

		if (isSelected) {
			let index = props.selectedItems.indexOf(props.name);
			let newItems = [...props.selectedItems];
			newItems.splice(index, 1);
			props.updateSelected(newItems);
		} else {
			props.updateSelected(props.selectedItems.concat(props.name));
		}
    };

    let displayName =
        props.name.substring(0, 1).toUpperCase() +
        props.name.substring(1, 2).toLowerCase();

    return (
        <div id={`week-${props.name}`}>
            <button
                className={`btn btn-sm btn-circle btn-active ${outlineClass}`}
                style={style}
                onClick={toggleButton}
            >
                {displayName}
            </button>
        </div>
    );
}

export const Week = (props) => {
	const renderDay = (day) => {
		return (
			<DayOfWeek
				name={day}
				selectedItems={props.selectedDays}
				updateSelected={props.updateDays}
			></DayOfWeek>
		);
	};

	return (
		<div>
			<div className="one-line">{DAYS_OF_WEEK.map(renderDay)}</div>
		</div>
	);
};

const TimeOfDay = (props) => {
	const [time, isSelected, updateSelected] = props.time;

	const toggleButton = () => {
		let val = !isSelected;
		updateSelected(val);
	};

	const activeClass = isSelected ? "btn-primary" : "btn-ghost";

	return (
		<span id={`time-${time}`}>
			<button
				className={`btn-space btn btn-sm ${activeClass}`}
				onClick={toggleButton}
			>
				{time.length === 5 ? time : "0" + time}
			</button>
		</span>
	);
};
export const TimeList = (props) => {

	function showTime(time) {
		return <TimeOfDay time={time}></TimeOfDay>;
	}

	return (
		<div className="time-list">
			{props.timeList.map(showTime)}
		</div>
	);
};

export function DropdownSelect(props) {
	const options = getDisplayOptions(props.values, props.displayKey);

	function renderOption(value) {
		return (
			<option value={value} key={props.name + "-" + value}>
				{value}
			</option>
		);
	}

	function setSelected(event) {
		props.updateSelected(event.target.value);
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

export const MainDuplicate = (props) => {
	if (props.disabled) {
		return <></>;
	} else {
		let activeClassName = props.active ? "btn-active" : "btn-disabled"
		return (
			<button
				className={`btn btn-lg btn-success btn-wide ${activeClassName}`}
				style={{"margin-top": "1vh"}}
				onClick={props.submitData}
			>Save</button>
		)
	}
};