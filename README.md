# CoolerSurvey

### A full-stack application built for doing surveys and allows customised content according to pre-defined access codes.
### *Simpler, Easier and Even More Special Process!*
### Make the person being asked feel valued. Just give them a *customised, unique and exclusive* invitation code (one person per code) to access the survey.


### Read more about:
1. [Server](#server)
2. [Database Schema](#database-schema)
3. [Client](#client)

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

# Database Schema

## 0. The database schema itself

![Database schema](public/CoolerDate.png)

## 1. Users + Codes
Each user can create their own customised `code`s to share.

Together, `(userId, Codes.id)` must be unique in the database. Each `(userId, Codes.id)` can be linked to a desired **`Profiles.id`** and its associated **`Respondent`**. 

## 2. Profiles
The `profile` can be linked to 1 or more `(userId, Codes.id)`. This gives users the freedom to assign a suitable profile bio fitting each receiver (to the best of the giver's opinion). For example, this profile bio can be for long-term relationship and may present more traits that attract such relationships, and a diffrent bio can be for one-night stand with *bolder* introduction. 

The receiver is who receives the code.


## 3. Respondent
This stores response from receiver if they decided to give response to each `(userId, Codes.id)`.



<br>

# Client

For the time being, you can access the code at [this link](https://github.com/rodonguyen/my_website/blob/master/src/pages/DateMe.js). Future plan is to migrate it to an independent repository. 
