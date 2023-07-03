const mongoose = require("mongoose");


async function main() {

    try {
        // mongoose.set("stricQuery", true)

        mongoose.connect("mongodb+srv://tancker1227:TYWbZb0KkSNH8qFy@cluster0.5usxwbo.mongodb.net/?retryWrites=true&w=majority")
    
    } catch (error) {
        console.log(`erro ${error}`)
    }
};


module.exports = main;