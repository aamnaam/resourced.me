const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resourceSchema = new Schema(
    {
        url: {type: String, required: true},
        description: {type: String, required: true}
    }
);

const listSectionSchema = new Schema(
    {
        title: {type: String, required: true},
        resources: {type: [resourceSchema], required: true}
    }
);

const listSchema = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: "User", required: true},
        module: {type: String, required: true},
        university: {type: String, required: true},
        course: {type: String, required: true},
        description: {type: String, required: true},
        sections: {type: [listSectionSchema], required: true}
    },
    {
        timestamps: true,
    }
);

ResourceList = mongoose.model("ResourceList", listSchema);
module.exports = ResourceList;