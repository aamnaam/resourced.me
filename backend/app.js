const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const port = process.env.port || 5000;

const listRouter = require("./routes/list");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

const app = express();
const corsConfig = {
	origin:
		process.env.NODE_ENV === "prod"
			? "https://resourced.me"
			: "http://localhost:3000",
	credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use("/api/list", listRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

// Connect to the database (Unless testing, in which case a fake DB is handled by tests/dbHandler.js)
if (process.env.MODE_ENV !== "test") {
	mongoose
		.connect(process.env.DB, { useNewUrlParser: true })
		.then(() => console.log(`Database connected successfully`))
		.catch((err) => console.log(err));
}

// This must be exported for unit tests
module.exports = { app, port };
