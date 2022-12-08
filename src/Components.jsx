import {getDisplayOptions} from "./utils.jsx";
import {DAYS_OF_WEEK, TIME_LIST} from "./config.jsx";

export function ListItem(props) {
	let isSelected = props.selectedItems.indexOf(props.name) !== -1;
    let outlineClass = isSelected ? props.highlight : "btn-ghost";

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

    return (
        <div id={`week-${props.name}`}>
            <button
                className={`${props.display} ${outlineClass}`}
                style={props.style}
                onClick={toggleButton}
            >
                {props.displayName}
            </button>
        </div>
    );
}

export const Week = (props) => {
	let itemStyle = {
        marginBottom: "1px",
    };

	const renderDay = (day) => {
		let displayName = day.substring(0, 1).toUpperCase() +
			 			  day.substring(1, 2).toLowerCase();
		return (
			<ListItem
				name={day}
				selectedItems={props.selectedDays}
				updateSelected={props.updateDays}
				displayName={displayName}
				display="btn btn-sm btn-circle btn-active"
				highlight="btn-accent"
				style={itemStyle}
			></ListItem>
		);
	};

	return (
		<div>
			<div className="one-line">{DAYS_OF_WEEK.map(renderDay)}</div>
		</div>
	);
};

export const TimeList = (props) => {

	function showTime(time) {
		let displayName = time.length === 5 ? time : "0" + time;
		return (
			<ListItem
				name={time}
				selectedItems={props.selectedTimes}
				updateSelected={props.updateTimes}
				displayName={displayName}
				display="btn btn-sm btn-space"
				highlight="btn-primary"
				style={{}}
			></ListItem>
		);
	}

	return (
		<div className="time-list">
			{TIME_LIST.map(showTime)}
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