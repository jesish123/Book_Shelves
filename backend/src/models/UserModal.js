const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        last_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: false
        },
        resetCode: {
            type: String,
            required: false,
            default: null
        },
        resetCodeExpiry: {
            type: Date,
            required: false,
            default: null
        },
        googleId: {
            type: String,
            required: false,
            default: null
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', UserSchema)
