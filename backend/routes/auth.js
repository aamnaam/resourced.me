const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const { OAuth2Client } = require("google-auth-library");
const dayjs = require("dayjs");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const loginCookieName = "loginToken";

router.post("/google", async (req, res) => {
	const { token } = req.body;
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_CLIENT_ID,
	});
	const { name, email, picture } = ticket.getPayload();

	const _id = await signUpIfNew(name, email, picture);

	const accessToken = generateAccessToken(_id, name, email, picture);
	const refreshToken = generateRefreshToken(_id, name, email, picture);
	const newRefreshToken = new RefreshToken({
		token: refreshToken,
	});
	try {
		await newRefreshToken.save();
	} catch (err) {
		console.log("Error occured while saving token");
	}
	res.status(202)
		.cookie(loginCookieName, refreshToken, {
			secure: process.env.NODE_ENV == "prod",
			httpOnly: false,
			sameSite: "strict",
			expires: dayjs().add(30, "days").toDate(),
		})
		.json({ accessToken: accessToken });
});

router.post("/logout", async (req, res) => {
	try {
		await RefreshToken.deleteOne({ token: req.cookies.loginToken });
	} catch (err) {
		console.log(err);
	}
	res.clearCookie(loginCookieName);
	res.status(202).json("Logged out");
});

router.post("/token", async (req, res) => {
	const refreshToken = req.cookies.loginToken;
	if (!refreshToken) return res.send("No refresh token present");
	const isAuthenticRefreshToken = await RefreshToken.findOne({
		token: req.cookies.loginToken,
	});
	if (!isAuthenticRefreshToken)
		return res.status(403).send("Invalid Refresh token");
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).send("Invalid Refresh Token");
		const accessToken = generateAccessToken(
			user._id,
			user.name,
			user.email,
			user.picture
		);
		res.status(202).json({ accessToken: accessToken });
	});
});

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["Authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userDetails) => {
		if (err) return res.sendStatus(403);
		req.email = userDetails.email;
		next();
	});
};

router.get("/secret", authenticateToken, (req, res) => {
	res.json(`${req.email}'s secrets!`);
});

const signUpIfNew = async (name, email, picture) => {
	let user = await User.findOne({ email });
	if (!user) {
		const newUser = new User({ name, email, picture });
		user = await newUser.save();
	}
	return user._id;
};

const generateAccessToken = (_id, name, email, picture) => {
	return jwt.sign({ _id, name, email, picture }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
};

const generateRefreshToken = (_id, name, email, picture) => {
	return jwt.sign({ _id, name, email, picture }, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = router;
