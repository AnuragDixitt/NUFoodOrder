var express = require("express");
var Router = express.Router();

// GET request 
// Just a test API to check if server is working properly or not
Router.get("/", function(req, res) {
	res.send("API is working properly !");
});

module.exports = Router;
