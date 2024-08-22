const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: String,
    projectDesc: String,
    mainImg: String,
    images: [String]
});


const Project = new mongoose.model("Project", projectSchema);

module.exports = Project;