const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const thirtyDaysInMinutes = 60 * 24 * 30;
const refreshTokenSchema = new Schema(
	{
		token: { type: String, required: true },
		createdAt: { type: Date, default: Date.now(), expires: `${thirtyDaysInMinutes}m`}
	},
);


refreshToken = mongoose.model("refreshToken", refreshTokenSchema);
module.exports = refreshToken;
