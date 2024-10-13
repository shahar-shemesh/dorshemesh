const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    archive: Boolean,
    projectName: String,
    projectDesc: String,
    mainImg: String,
    images: [String],
    order: Number,  // Field for storing the order of the projects
});


const Project = new mongoose.model("Project", projectSchema);

module.exports = Project;