const mongoose = require("mongoose");

const { schema } = mongoose;

const serviceSchema =new schema({
    name: {
        type: String,
        require: true
    },
    descripion: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require: true
    },
})