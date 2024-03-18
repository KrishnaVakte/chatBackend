const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    username:{

        type: String,
        require: true,
        min: 3,
        unique: true,
    },

    email: {

        type: String,
        require: true,
        unique: true,
    },

    password: {

        type: String,
        require: true,
        min:5,
    },

    isAvatarImageSet: {

        type: Boolean,
        default: false,

    },

    AvatarImage: {

        type: String,
        default: "",
    }
});

module.exports = mongoose.model("Users",userSchema)