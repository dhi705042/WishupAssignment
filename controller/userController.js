const userModel = require("../models/userModel");

const validator = require("../utils/validator");

const userRegistration = async function (req, res) {
    try {
        let userName = req.params.userName;

        if (!validator.isValidRequestParam(userName)) {
            return res.status(400).send({ status: false, msg: "request param is not valid, please provide UserName" });
        }
        const userCreated = await userModel.create({ userName: userName });

        res.status(200).send({ status: true, data: userCreated });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

const userDetail = async function (req, res) {
    try {
        let userName = req.params.userName;

        if (!validator.isValidRequestParam(userName)) {
            return res.status(400).send({ status: false, msg: `${userName} is not valid or does not exist}` });
        }

        const userDetails = await userModel.findOne({ userName: userName });

        if (!userDetails) {
            return res.status(404).send({ status: false, msg: `username ${userName} does not exist` })
        }

        res.status(200).send({ status: true, data: userDetails });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};

module.exports = {
    userRegistration,
    userDetail
}
