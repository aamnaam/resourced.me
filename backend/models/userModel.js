const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, requried: true },
    lists: [{type: Schema.Types.ObjectId, ref: "ResourceList", required: true}]
});

User = mongoose.model("User", userSchema);
module.exports = User;