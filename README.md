# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory "frontend", you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

The project backend is hosted in AWS.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
I upload the build folder's static files in AWS to s3 bucket.

### Code Splitting

I splitted the code in 2 environments: backend and frontend. Backend I uploaded to the s3 bucket and moved to the Lambda for fetching any interaction with the database: at he moment I created a table with AWS's DynamoDB for storing all registered users and operating the user's login functions and fetching their data for.

### Making a Progressive Web App

Frontend I also built and uploaded to the s3 Bucket in AWS. I added Google Map package to display the map and search for places. The user can type in places and click to save them in the list. I also created the DynamoDB table for storing places, that helps the display them on the list and place Markers on the Map. The user can also delete places by clicking on their buttons on the list. The function that is responsible for the comunication with the database I created with AWS service Lambda wich is calling the APIs that I created in Api Gateway service.

### Advanced Configuration
For the user register and login features I also used API Gateway, Incognito, AWS Amplify...

### Deployment

The deployed version for my test project is here: http://traveler-client-s3.s3-website.eu-north-1.amazonaws.com
