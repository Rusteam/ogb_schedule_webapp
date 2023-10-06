import { FC } from "react";

interface Props{
    name: string;
    displayName: string;
    display: string;
    selectedItems: string[];
    updateSelected: (value: string[]) => void;
    style: any;
    highlight: string;
}
    
    
const ListItem:FC<Props> = (props) => {
	let isSelected = props.selectedItems.indexOf(props.name) !== -1;
    const outlineClass = isSelected ? props.highlight : "btn-ghost";

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

export default ListItem;