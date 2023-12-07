const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

process.env.DB = "mongodb://localhost:27017/WhiteboardDB"; // Your MongoDB URI

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        console.log("Could not connect to the database!");
    }
};
