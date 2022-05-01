import React from "react";
import { Button } from "react-bootstrap";
import "./stylesheet.css";
import { useNavigate } from "react-router-dom";

const SearchResult = ({ result }) => {
	const env = process.env.REACT_APP_ENV;
	let HOME_URL = "";
	if (env === "prod") {
		HOME_URL = "https://resourced.me";
	} else {
		HOME_URL = "http://localhost:3000";
	}

	const navigate = useNavigate();
	const handleCopyLink = () => {
		navigator.clipboard.writeText(`${HOME_URL}/list/${result._id}`);
	};

	const handleGoTo = (_id) => {
		navigate(`/list/${_id}`);
	};

	return (
		<div className="resourceListResult">
			<p className="resourceListResultText">
				<b>{result.module.substring(0, 80)}{result.module.length > 80 ? "..." : ""}</b>
				<br />
				{result.university.substring(0, 35)}{result.university.length > 35 ? "..." : ""} -&nbsp;
				{result.course.substring(0, 35)}{result.course.length > 35 ? "..." : ""} <br />
				{result.description.substring(0, 80)}{result.description.length > 80 ? "..." : ""}
			</p>
			<div className="resourceListResultButtons">
				<Button
					variant="dark"
					size="sm"
					className="copyLinkBtn"
					onClick={handleCopyLink}
				>
					Copy Link
				</Button>

				<Button
					variant="dark"
					size="sm"
					onClick={() => handleGoTo(result._id)}
				>
					Go to Page
				</Button>
			</div>
		</div>
	);
};

export default SearchResult;
