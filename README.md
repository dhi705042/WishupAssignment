# WishupAssignment

Overview
You have been assigned with creating the primary REST
service for a "Subscription as a Service" startup . Your
REST service will be used by companies that will define
subscriptions plans to which the users of the platform can
subscribe to.

Instructions
General Instructions
The submission will be evaluated for:
Correctness
Code Readability: Please write well formatted,
readable code with appropriate variable naming

Technical Instructions
You MUST implement the API using Nodejs. You can
use any framework on top of Node.
Submission
Share the assignment as a link to git repo
The git repo needs to track the commits you made as
you solved the challenge. This is so that we can see
how your code evolved.
API Service
The primary aspect of this programming challenge is to
implement the following two APIs:

/user

/subscription

The details of each of these APIs are as follows:

/user
This is a simple CRUD API that adds a user to DB.
PUT /user/
creates a user with specified username in the DB.
Sample Input: PUT /user/jay
Required Output: Just a HTTP status: 200 on success,
other appropriate code for failures
GET /user/< username>
Sample Input: GET /user/jay
Sample Output:
{
"user_name": "jay"
,

/subscription
This is the primary API being tested in this challenge.
This will need to provide mechanisms to:
Register a new subscription for an existing user,
with a specified plan and start date
POST /subscription/
Inputs:
Sample Input
Expected Output:
"created_at": "2020-02-29 19:30:00"
}
{
"user_name": < username >,
"plan_id": < plan_id >,
"start_date": < date in YYYY-MM-DD format >
}
{ "user_name": "jay"
,
"plan_id": "PRO_1M"
,
"start_date": "2020-03-03" }
Sample Output:
Additional Details
On success, return 200 HTTP status. For failures, pick
an appropriate HTTP code.
The timestamp indicates the start date for the new
plan, and it will be valid for the number of days shown
in the table below
plan_id can be one of those listed in the table below:
GET /subscription/< username >/< date >
{ "status": <["SUCCESS"|"FAILIURE"]>,
"amount":
<+/- amount credited/debited> }
{ "status": "SUCCESS"
,
"amount": -200.0 }
Sample Input:
/subscription/jay/2020-02-29
Note that the date in the above is optional:
/subscription/jay
Expected Output:
When input date is specified
plan_id that will be active for user at specified
date.
Number of days left in plan from the specified
input date
Sample output
{ "plan_id": "PRO_1M"
,
"days_left": 3 }
When input date is NOT specified
List all subscription entries available in database
for user with start and valid till dates.
Sample output
[
{
"plan_id": "TRIAL"
,
"start_date": "2020-02-22"
,
"valid_till": "2020-02-28"
},
{
"plan_id": "PRO_1M"
,
"start_date": "2020-02-29"
,
"valid_till": "2020-03-30"
}
]
