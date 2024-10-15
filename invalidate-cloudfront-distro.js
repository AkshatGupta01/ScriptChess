const AWS = require("aws-sdk");

// initialize cloudfront client
const awsConfig = {
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}
const cloudFrontClient = new AWS.CloudFront(awsConfig)

//remove this log in production
// Github show  **** instead of your keys(some privacy things), so //don't panic if you see your password like that


let time = new Date().getTime() + "";
let invalidationObj = {
  "DistributionId" : process.env.DISTRIBUTION_ID,
  "InvalidationBatch" : {
    "Paths" : {
      "Quantity" : 1,
      "Items" : ["/*"]
    },
    "CallerReference" : time
  }
}
cloudFrontClient.createInvalidation(invalidationObj, (err,res)=> {
  if (err) {
    return
  }

})
