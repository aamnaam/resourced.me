import React from "react";
import { useState, useEffect, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import jwt_decode from "jwt-decode";
import SearchResult from "./SearchResult";
import HomepageIntro from "./HomepageIntro";
import { UserContext } from "../App";
import smile from "../images/smile.png";
import axios from "axios";
import "./stylesheet.css";

const Homepage = () => {
	const { user, setUser, autoLogin } = useContext(UserContext);
	const [university, setUniversity] = useState("");
	const [course, setCourse] = useState("");
	const [module, setModule] = useState("");
	const [results, setResults] = useState([]);

	useEffect(() => {
		document.title = "resourced.me";
		autoLogin();
	}, []);

	useEffect(() => {
		axios
			.get("/api/list/latest")
			.then((lists) => {
				setResults(lists.data);
			})
			.catch(() => {
				setResults([]);
			});
	}, []);

	const handleSearch = () => {
		const searchQuery = {
			module: module,
			course: course,
			university: university,
		};

		axios
			.get("/api/list/search", { params: searchQuery })
			.then((lists) => {
				setResults(lists.data);
			})
			.catch(() => {
				setResults([]);
			});
	};

	const handleLoginFailure = (result) => {
		alert(result);
	};

	const handleLoginSuccess = async (googleData) => {
		try {
			const res = await axios.post(
				"/api/auth/google",
				{ token: googleData.tokenId },
				{ withCredentials: true }
			);
			const decodedToken = jwt_decode(res.data.accessToken);
			setUser({
				name: decodedToken.name,
				email: decodedToken.email,
				picture: decodedToken.picture,
				accessToken: res.data.accessToken,
			});
		} catch (err) {
			console.log(err);
		}
	};

	const handleLogout = async () => {
		try {
			await axios.post("/api/auth/logout", {}, { withCredentials: true });
			setUser({
				name: "",
				email: "",
				picture: "",
				accessToken: "",
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="home" id="home-div">
			<div className="columns">
				<div className="leftColumn">
					<div className="headerHome">
						<div className="logoCreateList">
							<img src={smile} alt="Logo" className="logoImage" />
							<h1 className="logoText">resourced.me</h1>
						</div>
					</div>
					<div className="intro">
						<HomepageIntro />
						{user.name ? (
							<div>
								<div>Logged in as {user.name}</div>
								<br />
								<div className="buttonDL">
									<Link to="/create">
										<Button id="to-create-list" variant="dark" size="lg">
											Create a List
										</Button>{" "}
									</Link>
								</div>
								<div>
									<Button
										id="search-btn"
										variant="dark"
										size="md"
										onClick={handleLogout}
									>
										Log out
									</Button>{" "}
								</div>
							</div>
						) : (
							<GoogleLogin
								clientId={
									process.env.REACT_APP_GOOGLE_CLIENT_ID
								}
								buttonText={"Log in with Google"}
								onSuccess={handleLoginSuccess}
								onFailure={handleLoginFailure}
								theme="dark"
							/>
						)}
					</div>
				</div>
				<div className="rightColumn">
					<div className="search">
						<div className="inputTextField">
							<Form.Control
								type="university"
								id="university-box"
								value={university}
								onChange={(e) => setUniversity(e.target.value)}
								placeholder="University"
							/>
						</div>
						<div className="inputTextField">
							<Form.Control
								type="course"
								id="course-box"
								value={course}
								onChange={(e) => setCourse(e.target.value)}
								placeholder="Course"
							/>
						</div>
						<div className="inputTextField">
							<Form.Control
								type="module"
								id="module-box"
								value={module}
								onChange={(e) => setModule(e.target.value)}
								placeholder="Module"
							/>
						</div>
						<div>
							<Button
								id="search-btn"
								variant="dark"
								size="md"
								onClick={handleSearch}
							>
								Search
							</Button>{" "}
						</div>
					</div>
					<div className="searchResults">
						<p className="resultsText">Results</p>
						<div className="searchResultsScroll">
							<div>
								{results.length < 1 ? (
									<p>Sorry, no resources found :(</p>
								) : (
									results.map((result) => (
										<SearchResult
											key={result._id}
											result={result}
										/>
									))
								)}
							</div>
						</div>
					</div>
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

export default Homepage;
