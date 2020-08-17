# Repo for FASOC CRUD, Express and MongoDB

## Installation

1. run `npm install` 

## Usage 

1. run `npm run dev`
2. Navigate to `localhost:3000`

## Mongodb online access:
1. ID: admin
2. password : admin

## Description
The Fasoc CRUD web application is an interface allowing the user to visualize the content of the Fasoc Database.
The Databse contains all components for Integrated Circuits category as well as Capacitors.

### Search Mechanism
#### Full-text Search
The Full-text Search allows the user to search a string or a number among all records of the database. The search is performed in RT so the search results will be displayed as soon as the user starts inputing the text.

#### Query-like Search
This search is emplemented to perform a search similar to a mongodb query.
All fields are optional, meaning that if the user leave all fields blank, the result will display all records from the Database.

The user can fill in some spefications regarding the componenet to retreive from the Database. Below are the fields used to contruct the query:
1. Description: example clock, driver, buffer etc.
2. Subcategory: example controllers, fpga, clock etc. This will allow to narrow down the number of results.
In the following fields, the user can choose up to 2 values.
3. Current - Input Bias (mA): The first value will be used as **equal or greater than** and the second value as **less than or equal**
4. Min Operating Temp (°C):  The first value will be used as **equal or greater than** and the second value as **less than or equal**
5. Max Operating Temp (°C): The first value will be used as **equal or greater than** and the second value as **less than or equal**
6. Min Voltage - Supply (V): The first value will be used as **equal or greater than** and the second value as **less than or equal**
7. Max Voltage - Supply (V): The first value will be used as **equal or greater than** and the second value as **less than or equal**

Please note that any empty field will be ignored in the query.


