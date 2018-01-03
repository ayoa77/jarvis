TODO 
X Get sessions/cookies working
X Register
- email confirmation
X Login with csrf
X Logout button
- form Validator
- research more about mongoose and mongodb
X test and make sure database is working
- setup mongoose security ie - login and password
X talk to Alex about the database
- setup image uploading for kyc on user page(temporary)
- reasearch and setup helmet (easymode)
- finish setting up routes 
- Governance, WhitePaper, FAQ, DeepDive, medium blog route
- README
- Docker
- https/http2 - lets encrypt
- nginx to gzip
- CDN - Aryaka?
- SEO Optimization
- RBT.txt
- Sitemap
- Gcloud deploy

paymentSchema
- userId
- input dummy data
- walletId:[{ type: Schema.Types.ObjectId, ref: 'wallet' }],


userSchema
- id - number
- email - string
- password(salted) - string
- status:{ type: String, enum: ['NEW', 'EMAIL', 'APPROVED'], default: 'NEW'}	


walletSchema
- userid - number userRelation:[{ type: Schema.Types.ObjectId, ref: 'user' }],
- id - number
- jarvis - String
- ethereum - String

kycSchema
- userid - number userRelation:[{ type: Schema.Types.ObjectId, ref: 'user' }],
- images - [String]



