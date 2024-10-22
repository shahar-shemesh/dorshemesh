const mongoose = require("mongoose");


const pageSchema = new mongoose.Schema({
    pageName: String,
    pageContent: { type: ["integer", "string"] },
    pageImg: String,
});

const Page = new mongoose.model("Page", pageSchema);

module.exports = Page;