# nodejs-ecommerce
eCommerce backend project supporting MongoDB, Firebase, file and memory persistence mechanisms. Developed with Node.js.

## What do I need to run this project?
This API relies on the dotenv Node.js dependency in order to dynamically export DAOs on startup, as well as to securely initialize the project with sensitive variables. Hence, before you try to use it, please create a .env file on the root folder and add the following fields:

### To choose a database for each entity's persistence:
These variables take either 'memory', 'file', 'mongodb', or 'firebase' depending on your database preference.  
- PRODUCTS_DATABASE='<your-preferred-database>'  
- CARTS_DATABASE='<your-preferred-database>'  
- MESSAGE_DATABASE='<your-preferred-database>'  
- ORDER_DATABASE='<your-preferred-database>'

### For MongoDB:
- MONGODB_USERNAME='<your-mongodb-username>'  
- MONGODB_PASSWORD='<your-mongodb-password>'  
- MONGODB_URI='<your-mongodb-URI>'  
- MONGODB_DATABASE='<database-name>'

### For Firebase:
- I have included a sample SDK in this project for testing purposes, but feel free to add your own SDK to src/databases/firebase

### Twilio and SendGrid support:
- TWILIO_SID='<your-twilio-SID>'  
- TWILIO_TOKEN='<your-twilio-token>'  
- TWILIO_PHONE='<your-twilio-phone>'  
- MY_PHONE='<your-phone-number-for-testing>'  
- MY_EMAIL='<your-email-address>'  
- SENDGRID_API_KEY='<your-sendgrid-API-key>'

### JSON Web Token (JWT)
- JWT_KEY='<your-JWT-secret-key>'

## Execution scripts and arguments:
The server comes with two pre-defined scripts:  

To run the server with a single process with watch mode disabled:
> npm run start: "node bin/run.js"

To run the server with a single process with watch mode enabled (development mode):  
> npm run dev: "nodemon bin/run.js"

The execution script takes two arguments, --port (-p) to select the port your want the server to listen to, and --mode(-m) to choose between fork mode (a single process - default) and cluster mode (one process for every CPU core):   

For example, if you wanted to run the server in cluster mode listening on port 8000, you would run it as:
> npm run start -- -p 8000 -m cluster  

The default value for port is 8080, and the default mode is fork mode.

## Want to test it?
In the root directory, you will find the /tests folder with a Postman test collection in it. Feel free to import it to your Postman instance to try all the available endpoints.
