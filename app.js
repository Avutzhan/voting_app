var path = require('path');
var express = require('express');
var app = express();

app.get("/",function(req,res){res.send("test")});


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening...");
});
