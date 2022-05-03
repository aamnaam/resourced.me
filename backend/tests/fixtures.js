// This file contains constants useful for unit tests. e.g. example data that can be used for testing POST requests
const mongoose = require("mongoose");

module.exports.validList = {
    "author": new mongoose.Types.ObjectId(),
    "module": "LI Team Project",
    "university": "University of Birmingham",
    "course": "Computer Science",
    "description": "For creating a MERN stack team project",
    "sections": [
        {
            "title": "MERN Stack Basics",
            "resources": [
                {
                    "url": "https://www.youtube.com/watch?v=mrHNSanmqQ4",
                    "description": "A full MERN stack course by freecodecamp"
                },
                {
                    "url": "https://www.digitalocean.com/community/tutorials/getting-started-with-the-mern-stack",
                    "description": "DigitalOcean's MERN stack tutorial. A bit outdated but still useful."
                }
            ]
        },
        {
            "title": "Unit Testing",
            "resources": [
                {
                    "url": "https://dev.to/ryuuto829/setup-in-memory-database-for-testing-node-js-and-mongoose-1kop",
                    "description": "Tutorial that teaches you how to unit test API endpoints."
                }
            ]
        }
    ]
}

module.exports.emptyList = {
    "module": "Empty Module",
    "university": "University of Nothing",
    "couse": "No Studies",
    "Description": "Who even needs resources",
    "sections": []
}

module.exports.missingModuleList = {
    "university": "Bad resource list!",
    "course": "Delete this from the database!",
    "description": "Backend shouldn't allow this to be created!",
    "sections": []
}