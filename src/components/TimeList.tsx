import { FC } from "react";
import {TIME_LIST} from "../config";
import { ListItem } from ".";

interface TimeListProps{
    selectedTimes: string[];
    updateTimes: (value: string[]) => void;
}


const TimeList: FC<TimeListProps> = (props) => {
     
    const showTime = (time:string) => {
    const displayName = time.length === 5 ? time : "0" + time;
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

export default TimeList

