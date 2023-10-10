import {  FC, SyntheticEvent } from "react";
import { getDisplayOptions } from "../utils";
import { TimeZone } from "@vvo/tzdb";

interface Props {
	name: string;
	values:  TimeZone[];
	displayKey: string;
	selected?: string;
	updateSelected: (value: string) => void;

}
 const DropdownSelect:FC<Props> = (props) => {
	const options = getDisplayOptions(props.values, props.displayKey);
	const renderOption = (value:string) => {
		return (
			<option value={value} key={props.name + "-" + value}>
				{value}
			</option>
		);
	}


	const setSelected = (event: SyntheticEvent<HTMLSelectElement>) => {
		props.updateSelected((event.target as HTMLSelectElement).value);
	};

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

 export default DropdownSelect;