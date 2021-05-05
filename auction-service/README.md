# Serverless
Serverless example



Following steps to be done.

a) install aws cli on your account

b) get the code base for auction-service, notification-service and auth-service into your local system

c) Login to Auth0.com, signup for an account, configure a region for your account, add an application (sls-base?) for your account

d) Congigure your AWS account and region and ensure serverless.yml in all three services root directories are updated with the account. Also use AWS CLI aws configure command to configure your accountid, keys etc.

e) install serverless in your account. refer URL https://www.serverless.com/framework/docs/getting-started/

f) you will also need node.js and to run npm install in each of the root directories of services

g) go to root directory of each of the services and run "sls deploy -v" to deploy the services into your configured aws account. You will have to first install auth-service, then notification-service and then auth-service. Then run the auth-service private API to get the token as below.


configure AUCTIONS_HOST and AUTH_URL in your Postman global variables on the values obtained from the output of sls deploy commands on auction-service and auth-service respectively

run the following URL to get your token and copy the auth token text 

curl --location --request POST 'https://\<your auth0 account\>.us<or any other region>.auth0.com/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=\<copy client id from your auth0 settings\>' \
--data-urlencode 'username=\<you should add a user / role with a password - mention user name added to auth0 account here\>' \
--data-urlencode 'password=\<your password for the added user\>' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'scope=openid'

Copy the id_token value (long alpha numeric text). This will be your access token. configure this in POSTMAN as AUTH_TOKEN global variable as value

h) you can use postman to run the following invocations to test your services.

For creating an auction:

URL - POST - {{AUCTIONS_HOST}}/auction
Body - { "title" : "some description of the auction"}
Authorization: Configure Bearer token - and mention variable {{AUTH_TOKEN}}

For getting all auctions
URL - GET - {{AUCTIONS_HOST}}/auctions?status=OPEN
Params - status - OPEN / CLOSED etc. (which ever type of auctions you want)
Auth - same as above

For getting specific auction
URL - GET - {{AUCTIONS_HOST}}/auction/<auction id>
Auth - same as above

For placing bid
URL - PATCH - {{AUCTIONS_HOST}}/auction/<auction id>/bid
Body - { "amount": 41 }
Auth - same as above

Please note that you have to change email ID (either created user or bidder in the DynamoDB yourself - else you will get error - when you try to place a bid - saying you cant place bid on your own auctions)

Also - Ensure you add email id and verify them in Simple Mail service before any notifications can be sent out.

i) Last - Ensure you configure the periodicity of your processAuctions (in auction-service - processAuctions service) as appropriate in the schedule parameters.

Post a query if there are any issues

