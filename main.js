/* 
Use this code snippet in your app.
 
sample secrets:

 {
  "env": "dev",
  "foo": "bar"
 }
*/

'use strict';

const team = process.env.TEAM;
const project = process.env.PROJECT;
const env = process.env.ENVIRONMENT;
const secret_name = team + "/" + project + "/" + env;
console.log(secret_name);

// Load the AWS SDK
var AWS = require('aws-sdk'),
    endpoint = "https://secretsmanager.ap-southeast-2.amazonaws.com",
    region = "ap-southeast-2",
    secretName = secret_name,
    secret,
    binarySecretData;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    endpoint: endpoint,
    region: region
});

client.getSecretValue({
    SecretId: secretName
}, function(err, data) {
    if (err) {
        if (err.code === 'ResourceNotFoundException')
            console.log("The requested secret " + secretName + " was not found");
        else if (err.code === 'InvalidRequestException')
            console.log("The request was invalid due to: " + err.message);
        else if (err.code === 'InvalidParameterException')
            console.log("The request had invalid params: " + err.message);
    } else {
        // Decrypted secret using the associated KMS CMK
        // Depending on whether the secret was a string or binary, one of these fields will be populated
        if (data.SecretString !== "") {
            secret = JSON.parse(data.SecretString);
            console.dir(secret)
            console.log(secret.foo);
        } else {
            binarySecretData = data.SecretBinary;
            console.log(binarySecretData);
        }
    }

    // Your code goes here. 

});
