# CoolerDate

### A full-stack application built for Asking someone out for a date. 
### *Simpler, Easier and Even More Special Process!*
### Make the person being asked feel valued. Just give the them a *customised, unique and exclusive* invitation code (one person per code) to access your profile, get to know you and response later. That code expires after 3 days since they first open it. 


### Read more about:
- [Server](#server)
- [Client](#client)

# Server

Consists of RestAPI endpoints that the Front-End use to interact with MongoDB.  
Built with: ExpressJS, Axios, Mongoose, Swagger-jsdoc.  
Tests written with: Chai.

### Getting Started

- Start the server in dev mode (with nodemon):   
   ```
   npm run dev
   ```
- Run server for deployment: 
   ```
   npm run start
   ```
- Run tests: 
   ```
   npm run test
   ```

### Documentation
Once the server is up and running (by entering `npm run dev`), interactive Swagger Documentation can be found in 
   ```
   http://127.0.0.1:3001/coolerdate/api-docs
   ```

# Client

For the time being, you can access the code at [this link](https://github.com/rodonguyen/my_website/blob/master/src/pages/DateMe.js). Future plan is to migrate it to an independent repository. 
