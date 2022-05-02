import React from "react";
import { useState, createContext } from "react";
import Homepage from "./components/Homepage";
import CreateList from "./components/CreateList";
import EditList from "./components/EditList";
import DisplayList from "./components/DisplayList";
import PrivacyPolicy from "./components/PrivacyPolicy";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const UserContext = createContext();

function App() {
	const [user, setUser] = useState({
		_id: "",
		name: "",
		picture: "",
		accessToken: "",
	});

	const autoLogin = async () => {
		if (user.name) return;
		try {
			const res = await axios.post(
				"/api/auth/token",
				{},
				{ withCredentials: true }
			);
			if (!res.data.accessToken) return;
			const decodedToken = jwt_decode(res.data.accessToken);
			setUser({
				_id: decodedToken._id,
				name: decodedToken.name,
				picture: decodedToken.picture,
				accessToken: res.data.accessToken,
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Router>
			<UserContext.Provider value={{ user, setUser, autoLogin }}>
				<div style={{ fontFamily: "Comic Sans MS" }}>
					<Routes>
						<Route exact path="/" element={<Homepage />} />
						<Route exact path="/create" element={<CreateList />} />
						<Route exact path="/edit/:id" element={<EditList />} />
						<Route
							exact
							path="/list/:id"
							element={<DisplayList />}
						/>
						<Route
							exact
							path="/privacypolicy"
							element={<PrivacyPolicy />}
						/>
					</Routes>
				</div>
			</UserContext.Provider>
		</Router>
	);
}

export default App;
