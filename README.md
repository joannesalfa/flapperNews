
#Flapper News App

Simple MEAN stack app using Node.js, ExpressJS, AngularJS and MongoDB

Completed tutorial from [Thinkster - MEAN Stack Tutorial](https://thinkster.io/mean-stack-tutorial/)



###### Requirements: Node.js & MongoDB
###### Optional Requirements: PaperTrail



## Deploying to Heroku
1. Open Terminal.
2. Type: "heroku login" process with your user and pass.
3. Type: "git init" in current project directory.
4. Do command lines below.

##### NOTE if you read ******variables****** you should replace them with registered external variables. 
##### We use [Mongolab](https://www.mongolab.com) to get mongoDB database for free. For testing purposes.
##### We use [Papertrail](https://papertrailapp.com/) to get logs for free. For monitoring purposes.
------------

```bash
heroku apps:create **example**
heroku config:set DATABASE_URL=mongodb://**dbuser**:**dbpassword**@**id**.mongolab.com:**port**/**database**
heroku drains:add syslog://**host**.papertrailapp.com:**port**
git add . -A
git commit -m 'changes'
git push heroku master
heroku ps:scale web=1
heroku open
```
-------------
# Test locally
1. Set env variables 
    - **PORT** (optional, default 5000) 
    - **DATABASE_URL** (optional,default:localhost/news)
2. Run mongod
3. npm start


