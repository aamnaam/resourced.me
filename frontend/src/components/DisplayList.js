import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Section from "./Section";
import { UserContext } from "../App";
import axios from "axios";

import smile from "../images/smile.png";
import "./stylesheet.css";

const DisplayList = () => {

	const navigate = useNavigate();

	const env = process.env.REACT_APP_ENV;
	let HOME_URL = "";
	if (env === "prod") {
		HOME_URL = "https://resourced.me";
	} else {
		HOME_URL = "http://localhost:3000";
	}

	const { user, setUser, autoLogin } = useContext(UserContext);
	const { id } = useParams();
	const [list, setList] = useState({
		author: "",
		module: "",
		university: "",
		course: "",
		description: "",
		sections: [],
	});
	const [authorName, setAuthorName] = useState("");
	const [userIsOwner, setUserIsOwner] = useState(false);

	const sections = list.sections;
	useEffect(() => {
		autoLogin();
	}, []);
	
	useEffect(() => {
		const fetchData = async () => {
			const res = await axios.get(`/api/list/find/${id}`);
			setList({
				author: res.data.author,
				module: res.data.module,
				university: res.data.university,
				course: res.data.course,
				description: res.data.description,
				sections: res.data.sections,
			});
			document.title = `${res.data.module} • resourced.me`;
			let authHeaders = null;
			if (user.name) {
				authHeaders = {
					Authorization: `BEARER ${user.accessToken}`,
				};
			}
			const res2 = await axios.get(`/api/users/${res.data.author}`, {
				headers: authHeaders,
			});
			if (user._id === res.data.author) {
				setUserIsOwner(true);
			}
			setAuthorName(res2.data.name);
		}
		fetchData();
	}, [user]);

	const handleCopyLink = () => {
		navigator.clipboard.writeText(`${HOME_URL}/list/${id}`);
	};

	const handleEdit = () => {
		navigate(`../edit/${id}`);
	};

	return (
		<div className="displayList">
			<div className="logoCentre">
				<Link to="/" className="BLOO">
					<div className="logo">
						<img src={smile} alt="Logo" className="logoImage" />
						<h1 className="logoText">resourced.me</h1>
					</div>
				</Link>
			</div>
			<div className="dlBox">
				<b id="module">Author:</b> {authorName} <br />
			</div>
			<div className="dlBox">
				<b id="module">Module:</b> {list.module} <br />
			</div>
			<div>
				<b id="university">University:</b> {list.university} <br />
			</div>
			<div>
				<b id="course">Course:</b> {list.course} <br />
			</div>
			<div>
				<b id="description">Description:</b> {list.description} <br />
			</div>
			{/* <b>Sections:</b> */}
			{sections.map((section) => (
				<Section key={section.title} sectionData={section} />
			))}

			<br />

			<div className="multipleButtons">
				<div className="buttonDL">
					<Link to="/create">
						<Button id="to-create-list" variant="dark" size="lg">
							Create a List
						</Button>{" "}
					</Link>
				</div>

				<div className="buttonDL">
					<Link to="/">
						<Button id="to-home" variant="dark" size="lg">
							Return Home
						</Button>{" "}
					</Link>
				</div>

				<div className="buttonDL">
					<Button
						className="listPageCopyLinkBtn"
						variant="dark"
						size="lg"
						onClick={handleCopyLink}
					>
						Copy Link
					</Button>
				</div>
				<div className="ButtonDL">
					<Button
						className="listPageEditBtn"
						variant="dark"
						size="lg"
						disabled={!userIsOwner}
						onClick={handleEdit}
					>
						Edit List
					</Button>
				</div>
			</div>
			<hr />
			<div className="footer">
				<p>2022 • resourced.me</p>
				<Link to="/privacypolicy" className="privPolLink">
					Privacy Policy
				</Link>
			</div>
		</div>
	);
};

export default DisplayList;
