import {getDisplayOptions} from "./utils.jsx";

export function DayOfWeek(props) {
    let style = {
        marginBottom: "1px",
    };
    let outlineClass = props.isSelected ? "btn-accent" : "btn-ghost";

    const toggleButton = () => {
        let val = !props.isSelected;
        props.updateSelected(val);
    };

    let name =
        props.name.substring(0, 1).toUpperCase() +
        props.name.substring(1, 2).toLowerCase();

    return (
        <div id={`week-${props.name}`}>
            <button
                className={`btn btn-sm btn-circle btn-active ${outlineClass}`}
                style={style}
                onClick={toggleButton}
            >
                {name}
            </button>
        </div>
    );
}

export const Week = (props) => {
	const renderDay = (time) => {
		let [name, isSelected, updateSelected] = time;
		return (
			<DayOfWeek
				name={name}
				isSelected={isSelected}
				updateSelected={updateSelected}
			></DayOfWeek>
		);
	};

	return (
		<div>
			<div className="one-line">{props.days.map(renderDay)}</div>
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
				{time}
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
	if (props.user.first_name !== "John Doe") {
		return <></>;
	} else {
		let activeClassName = props.active ? "btn-active" : "btn-disabled"
		return (
			<button
				className={`btn btn-lg btn-success btn-wide ${activeClassName}`}
				onClick={props.submitData}
			>Submit</button>
		)
	}
};