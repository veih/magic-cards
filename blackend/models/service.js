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
}, { timestamps: true})

const Service = mongoose.model("Service", serviceSchema);

module.exports = {
    Service,
    serviceSchema,
}

// parou no 26:39 minutos https://www.youtube.com/watch?v=anMK76I2dUA&t=255s

