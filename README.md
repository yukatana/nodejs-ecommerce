# backend-final-project
Backend final project for Coderhouse. Developed with Node.js.

## What do I need to run this project?
This API relies on the dotenv Node.js dependency in order to dynamically export DAOs on startup. Hence, before you try to use it, please create a .env file on the root folder and add the following fields:

### For any database:
PRODUCTS_DATABASE='mongoDB' - this variable takes either 'memory', 'file', 'mongoDB', or 'firebase' depending on your database preference.  
CARTS_DATABASE='mongoDB' - same as above.

### For mongoDB:
MONGODB_USERNAME='your mongoDB username'  
MONGODB_PASSWORD='your mongoDB password'  
MONGODB_URI='your mongoDB URI'  
MONGODB_DATABASE='your mongoDB database name'

### For Firebase:
