import React from "react";
import { useState, useEffect, useContext } from "react";
import smile from "../images/smile.png";
import "./stylesheet.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { UserContext } from "../App";
import axios from "axios";

const CreateList = () => {

	const navigate = useNavigate();

	useEffect(() => {
		autoLogin();
	}, []);

	const newSection = {
		title: "",
		resources: [{ url: "", description: "" }],
	};

	const env = process.env.REACT_APP_ENV;
	let HOME_URL = "";
	if (env === "prod") {
		HOME_URL = "https://resourced.me";
	} else {
		HOME_URL = "http://localhost:3000";
	}

	const { user, setUser, autoLogin } = useContext(UserContext);
	const [acceptedPolicy, setAcceptedPolicy] = useState(false);
	const [module, setModule] = useState("");
	const [university, setUniversity] = useState("");
	const [course, setCourse] = useState("");
	const [description, setDescription] = useState("");
	const [sections, setSections] = useState([newSection]);

	useEffect(() => {
		document.title = "Create a List";
	}, []);

	// updates title of sections[index] when corresponding form element is changed
	const handleSecTitleChange = (secIndex, e) => {
		let data = [...sections];
		data[secIndex]["title"] = e.target.value;
		setSections(data);
	};

	// updates URL of sections[secIndex]["resources"][resourceIndex] when corresponding form element is changed
	const handleResUrlChange = (secIndex, resourceIndex, e) => {
		let data = [...sections];
		data[secIndex]["resources"][resourceIndex]["url"] = e.target.value;
		setSections(data);
	};

	// updates description of sections[secIndex]["resources"][resourceIndex] when corresponding form element is changed
	const handleResDescChange = (secIndex, resourceIndex, e) => {
		let data = [...sections];
		data[secIndex]["resources"][resourceIndex]["description"] =
			e.target.value;
		setSections(data);
	};

	// adds a new section placeholder to sections
	const addSection = () => {
		let data = [...sections];
		data.push({
			title: "",
			resources: [{ url: "", description: "" }],
		});
		setSections(data);
	};

	// removes sections[index] from sections
	const removeSection = () => {
		let data = [...sections];
		data.pop();
		setSections(data);
	};

	// adds new resource placeholder to sections[secIndex]["resources"]
	const addResource = (secIndex) => {
		let data = [...sections];
		data[secIndex]["resources"].push({ url: "", description: "" });
		setSections(data);
	};

	// removes sections[secIndex]["resources"][resourceIndex] from sections
	const removeResource = (secIndex) => {
		let data = [...sections];
		data[secIndex]["resources"].pop();
		setSections(data);
	};

	const handleCheckboxChange = () => {
		setAcceptedPolicy(!acceptedPolicy);
	};

	const handleSubmit = () => {
		let data = {
			module: module,
			university: university,
			course: course,
			description: description,
			sections: sections,
		};

		if (!acceptedPolicy) return;
		axios
			.post(`/api/list/create` , data, {
				headers: {
					"Authorization": `BEARER ${user.accessToken}`
				}
			})
			.then((res) => {
				const newId = res.data._id;
				navigate(`../list/${newId}`);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="createListOverall">
			<div className="header">
			<Link to="/" className="BLOO">
				<div className="logoCreateList">
					<img src={smile} alt="Logo" className="logoImage" />
					<h1 className="logoText">resourced.me</h1>
				</div>
			</Link>
				<div className="buttonDLCreateList">
					<Link to="/">
						<Button id="return-home" variant="dark" size="lg">
							Return Home
						</Button>{" "}
					</Link>
				</div>
			</div>

			<div className="createList">
				<Form>
					<Form.Group className="mb-3">
						<Form.Label>
							<b>Module</b>
						</Form.Label>
						<Form.Control
							id="module-box-create"
							type="module"
							value={module}
							onChange={(e) => setModule(e.target.value)}
							placeholder="Enter module name"
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>
							<b>University</b>
						</Form.Label>
						<Form.Control
							id="university-box-create"
							type="university"
							value={university}
							onChange={(e) => setUniversity(e.target.value)}
							placeholder="Enter university name"
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>
							<b>Course</b>
						</Form.Label>
						<Form.Control
							id="course-box-create"
							type="course"
							value={course}
							onChange={(e) => setCourse(e.target.value)}
							placeholder="Enter course name"
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>
							<b>Description</b>
						</Form.Label>
						<Form.Control
							id="description-box"
							type="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Enter description"
							as="textarea"
							rows={3}
						/>
					</Form.Group>

					{/* rendering a form part for each section in sections */}
					{sections.map((section, secIndex) => {
						return (
							<div key={secIndex}>
								<Form.Group className="mb-1">
									<div className="sectionWithButton">
										<Form.Label>
											<b>{`Section ${secIndex + 1}`}</b>
										</Form.Label>
									</div>
									<Form.Control
										type="section"
										onChange={(e) =>
											handleSecTitleChange(secIndex, e)
										}
										placeholder="Enter section title"
									/>
								</Form.Group>

								{/* rendering  a form part for each resource in sections[secIndex]["resources"] */}
								{section["resources"].map(
									(resource, resourceIndex) => {
										return (
											<div key={resourceIndex}>
												<div className="resourceBreak">
													<Form.Group className="mb-1">
														<Form.Control
															type="resourceUrl"
															onChange={(e) =>
																handleResUrlChange(
																	secIndex,
																	resourceIndex,
																	e
																)
															}
															placeholder="Enter resource URL"
														/>
													</Form.Group>

													<Form.Group className="mb-1">
														<Form.Control
															type="resourceDesc"
															onChange={(e) =>
																handleResDescChange(
																	secIndex,
																	resourceIndex,
																	e
																)
															}
															placeholder="Enter description"
														/>
													</Form.Group>
												</div>
											</div>
										);
									}
								)}

								<div className="resourceButtons">
									{/* ADD RESOURCE button */}
									<div className="addResource">
										<Button
											variant="dark"
											size="sl"
											className="addBtn"
											onClick={() => {
												addResource(secIndex);
											}}
										>
											+
										</Button>
										<p className="btnSideText">
											Add New Resource
										</p>
									</div>

									{/* 'REMOVE RESOURCE' BUTTON, only rendered if there are more than 1 resources in this section */}
									{sections[secIndex]["resources"].length >
										1 && (
										<div className="removeResource">
											<Button
												variant="dark"
												size="sm"
												className="minusBtn"
												onClick={() => {
													removeResource(secIndex);
												}}
											>
												-
											</Button>
											<p className="btnSideText">
												Remove Resource
											</p>
										</div>
									)}
								</div>
							</div>
						);
					})}
					<hr className="hrLol"></hr>
					<div className="sectionButtons">
						{/* ADD SECTION button */}
						<div className="addSection">
							<Button
								variant="dark"
								size="sl"
								className="addBtn"
								onClick={addSection}
							>
								+
							</Button>
							<p className="btnSideText">Add New Section</p>
						</div>

						{/* 'REMOVE SECTION' button */}
						{sections.length > 1 && (
							<div className="removeSection">
								<Button
									variant="dark"
									size="sm"
									className="minusBtn"
									onClick={removeSection}
								>
									{" "}
									-
								</Button>
								<p className="btnSideText">Remove Section</p>
							</div>
						)}
					</div>

					<br />

					<Form.Group className="mb-3" controlId="formBasicCheckbox">
						<Form.Check
							id="accept-policy-create"
							type="checkbox"
							onChange={handleCheckboxChange}
							label={
								<p>
									I have read and agree to the{" "}
									<Link to="/privacypolicy" target="_blank">
										Privacy Policy
									</Link>
								</p>
							}
						/>
					</Form.Group>
				</Form>

				<div className="submitBtn">
					<Button
						id="submit-btn"
						variant="dark"
						size="lg"
						disabled={!acceptedPolicy}
						onClick={handleSubmit}
					>
						Submit
					</Button>{" "}
				</div>
			</div>
		</div>
	);
};

export default CreateList;
