const userModel = require("../models/userModel")
const subscriptionModel = require("../models/subscriptionModel")

const validator = require("../utils/validator")

const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/ ;

let planIdArray = ["FREE", "TRIAL", "LITE_1M", "PRO_1M", "LITE_6M", "PRO_6M"]
let validity = [-1, 7, 30, 30, 180, 180]
let cost = [0, 0, 100, 200, 500, 900]



const registrationOfSubscription = async function (req, res) {
    try {
        let requestBody = req.body;

        if(!validator.isValidRequestBody(requestBody)){
          return res.status(400).send({ status: false, msg: "request body is required" })
        }

        const {userName, planId, startDate} = requestBody;

        if(!validator.isValid(userName)){
         return res.status(400).send({ status: false, msg: `userName is required` })
        }

        if(!validator.isValid(planId)){
            return res.status(400).send({ status: false, msg: `planId is required` })
           }

        let validPlanId = planIdArray.includes(planId)
        if(!validPlanId){
            return res.status(400).send({ status: false, msg: `${planId} is not a valid planid}` })
        }

        if(!validator.isValid(startDate)){
            return res.status(400).send({ status: false, msg: `startDate is required` })
           }

        let validStartDate = dateRegex.test(startDate)
        if(!validStartDate){
            return res.status(400).send({ status: false, msg: `${startDate} is not a valid date format}` }) 
        }
        
        const isUserPresent = await userModel.findOne({ userName:userName });

        if(!isUserPresent){
            return res.status(400).send({ status: false, msg: `${userName} is not registered` })
        }

       const newSubscription = {userName, planId, startDate}

       const registerSubscription = await subscriptionModel.create(newSubscription)

       let amountDebited = cost[planIdArray.indexOf(planId)]
       res.status(200).send({ status: true, msg: `Amount: -${amountDebited} debited` });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}



module.exports = {
    registrationOfSubscription 
}
