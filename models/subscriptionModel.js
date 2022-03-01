const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: "User Name is required",
        trim: true,
    },
    planId: {
        type: String,
        required: "planId is required",
        enum: ["FREE", "TRIAL", "LITE_1M", "PRO_1M", "LITE_6M", "PRO_6M"]
    },
    startDate: {
        type: String,
        required: "Start Date is required"
    }

}, { timestamps: true })

module.exports = mongoose.model('Subscription', subscriptionSchema)