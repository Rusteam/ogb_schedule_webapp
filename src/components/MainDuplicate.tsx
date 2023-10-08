import { FC } from "react";

interface Props{
	disabled: boolean;
	active: boolean;
	submitData: () => void;
}


const MainDuplicate:FC<Props> = (props) => {
	if (props.disabled) {
		return <></>;
	} else {
		const activeClassName = props.active ? "btn-active" : "btn-disabled"
		return (
			<button
				className={`btn btn-lg btn-success btn-wide ${activeClassName}`}
				style={{marginTop: "1vh"}}
				onClick={props.submitData}
			>Save</button>
		)
	}
};

export default MainDuplicate