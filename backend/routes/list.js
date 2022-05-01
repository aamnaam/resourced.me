const router = require("express").Router();
const jwt = require("jsonwebtoken");
let ResourceList = require("../models/listModel.js");

router.route("/find/:id").get((req, res) => {
	let reqId = req.params.id;
	ResourceList.findById(reqId)
		.then((list) => {
			if (list) return res.json(list);
			else
				return res
					.status(400)
					.json(
						`Error: Could not find resource list with id ${reqId}`
					);
		})
		.catch((err) => res.status(400).json("Error: " + err));
});

router.route("/search").get((req, res) => {
	let module = req.query.module;
	let course = req.query.course;
	let university = req.query.university;

	let searchParams = {};
	if (module) {
		searchParams = { ...searchParams, module: { $regex: module, $options: 'i' } };
	}
	if (course) {
		searchParams = { ...searchParams, course: { $regex: course,  $options: 'i'  } };
	}
	if (university) {
		searchParams = {
			...searchParams,
			university: { $regex: university, $options: 'i' },
		};
	}

	ResourceList
		.find(searchParams)
		.select("module course university description")
		.exec()
		.then((lists) => res.json(lists))
		.catch((err) => res.status(412).json("Error: " + err));
});

router.route("/latest").get((req, res) => {
	ResourceList.find()
		.limit(10)
		.sort({ createdAt: -1 })
		.select("module course university description")
		.exec()
		.then((lists) => res.json(lists))
		.catch((err) => res.status(400).json("Error: " + err));
});

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userDetails) => {
		if (err) return res.sendStatus(403);
		req._id = userDetails._id;
		next();
	});
};

router.route("/create").post(authenticateToken, (req, res) => {
	const _id = req._id;
	const module = req.body.module;
	const university = req.body.university;
	const course = req.body.course;
	const description = req.body.description;
	const sections = req.body.sections;

	const newResourceList = new ResourceList({
		author: _id,
		module,
		university,
		course,
		description,
		sections,
	});

	newResourceList
		.save()
		.then((resouceList) => res.json(resouceList))
		.catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
