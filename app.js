const http = require('http');

const fetch = require("cross-fetch"); // npm install cross-fetch
const FormData = require("isomorphic-form-data"); // npm install isomorphic-form-data

const express = require("express"); // npm install express
//const cors = require('cors'); // npm install cors

const app = express();

const hostname = '127.0.0.1';
const port = 3001;
const YOUR_CLIENT_ID = 'YOUR_CLIENT_ID';
const YOUR_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';


app.listen(port, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});

app.get("/", (req, res) => {
  
  let parameters = new FormData();
  parameters.append('f', 'json');
  parameters.append('client_id', YOUR_CLIENT_ID);
  parameters.append('client_secret', YOUR_CLIENT_SECRET);
  parameters.append('grant_type', 'client_credentials');
  parameters.append('expiration', 1440);
  
  fetch(
    "https://www.arcgis.com/sharing/rest/oauth2/token",
    { method: 'POST', body: parameters })
  .then(function(response) {
      response.json()
      .then(function(arcgisResponse) {
        if (arcgisResponse.error) {
          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          
          res.end(arcgisResponse.error.message);
        } else {
          let access_token = arcgisResponse.access_token; // expires in 1440 minutes
          res.statusCode = 200;
		  
          console.log('access_token:'+access_token);
          
          res.sendFile(__dirname + "/index.html");
        }
      })
      .catch(function(error) {
          //reject(error);
          console.error("Something bad happened", error);
      })
  });
  
});




