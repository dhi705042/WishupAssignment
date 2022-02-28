const userModel = require("../models/userModel")
const subscriptionModel = require("../models/subscriptionModel")

const validator = require("../utils/validator")

const dateRegex = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/ ;

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

const getSubscriptionWithDate = async function(req, res){
    try{

        let userName = req.params.userName;
        let inputDate = req.params.inputDate;

        if(!validator.isValidRequestParam(userName)){
            return res.status(400).send({ status: false, msg: `userName is required` })
           }

           const isUserPresent = await userModel.findOne({ userName:userName });

           if(!isUserPresent){
               return res.status(400).send({ status: false, msg: `${userName} is not registered` })
           }

           if(!validator.isValidRequestParam(inputDate)){
            return res.status(400).send({ status: false, msg: `inputDate is required` })
           }

        let validDate = dateRegex.test(inputDate)
        if(!validDate){
            return res.status(400).send({ status: false, msg: `${inputDate} is not a valid date format` }) 
        }

        let userSubscription = await subscriptionModel.find({userName:userName})
        if(!userSubscription){
            return res.status(400).send({ status: false, msg: `${userName} has no subscription as of now}` })
        }

        let userDetails = []
        for(let i = 0; i<userSubscription.length; i++){

            if(userSubscription[i].planId == 'FREE'){
              let tempObj = { Plan_Id : `${userSubscription[i].planId}`, Days_Left : `Unlimited`}
              userDetails.push(tempObj);
            } 
            let startDate = new Date(userSubscription[i].startDate).getTime()

            let currentDate = new Date(inputDate).getTime();

            let timePassed = currentDate - startDate
            
            let indexOfPlanId = planIdArray.indexOf(userSubscription[i].planId)

            let days_left = validity[indexOfPlanId] - (Math.floor((timePassed/86400)/1000))
            if(days_left > 0){
                let obj = {plan_id: userSubscription[i].planId, Days_left: days_left}
                userDetails.push(obj)
            }

        }
        if(userDetails.length == 0){
           return res.status(201).send({ status: true, data : `${userName} has no active subscription` })
        }

        res.status(201).send({ status: true, data : userDetails })

    }catch(error){
        res.status(500).send({ status: false, msg: error.message })
    }
}

const getSubscription = async function(req, res){
    try{

        let userName = req.params.userName;

        if(!validator.isValidRequestParam(userName)){
            return res.status(400).send({ status: false, msg: `userName is required` })
           }

           const isUserPresent = await userModel.findOne({ userName:userName });

           if(!isUserPresent){
               return res.status(400).send({ status: false, msg: `${userName} is not registered` })
           }

        let userSubscription = await subscriptionModel.find({userName:userName})
        if(!userSubscription){
            return res.status(400).send({ status: false, msg: `${userName} has no subscription as of now}` })
        }

        let userDetails = []
        for(let i = 0; i<userSubscription.length; i++){

            if(userSubscription[i].planId == 'FREE'){
              let tempObj = { Plan_Id : `${userSubscription[i].planId}`, start_date: userSubscription[i].startDate, valid_till: `Unlimited`}
              userDetails.push(tempObj);
            } 
            let indexOfPlanId = planIdArray.indexOf(userSubscription[i].planId)

            let startDate = new Date(userSubscription[i].startDate).getTime()

            let expiry = startDate + 86400*1000*(validity[indexOfPlanId])
            let expiryDate = new Date(expiry)
        //     console.log(expiryDate.getUTCFullYear() +"-"+ expiryDate.getUTCMonth() + "-"+ expiryDate.getUTCDay())
        //   let expiryy = (expiryDate.getUTCFullYear() +"-"+ expiryDate.getUTCMonth() + "-"+ expiryDate.getUTCDay())
        //   console.log(expiryy)


                let obj = {plan_id: userSubscription[i].planId, start_date: userSubscription[i].startDate, valid_till: expiryDate}
                userDetails.push(obj) 
            }

        if(userDetails.length == 0){
           return res.status(201).send({ status: true, data : `${userName} has no active subscription` })
        }

        res.status(201).send({ status: true, data : userDetails })

    }catch(error){
        res.status(500).send({ status: false, msg: error.message })
    }
}
 
module.exports = {
    registrationOfSubscription ,
    getSubscriptionWithDate,
    getSubscription
}
