const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		next();
		return;
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userDetails) => {
		if (err) return res.sendStatus(403);
		req._id = userDetails._id;
		next();
	});
};

router.route("/:id").get(authenticateToken, (req, res) => {
	let reqId = req.params.id;
	User.findById(reqId)
		.then((user) => {
			if (user) {
				if (!req._id || req._id !== user._id.toString()) {
					user.email = null;
					user.picture = null;
				}
				return res.json(user);
			} else
				return res
					.status(400)
					.json(
						`Error: Could not find resource list with id ${reqId}`
					);
		})
		.catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
