import { FC } from "react";
import {DAYS_OF_WEEK} from "../config";
import ListItem from "./ListItem";


interface WeekProps{
	selectedDays: string[];
	updateDays: (value: string[]) => void;
}

const Week:FC<WeekProps> = (props) => {
	const itemStyle = {
        marginBottom: "1px",
    };

	const renderDay = (day:string) => {
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

export default Week