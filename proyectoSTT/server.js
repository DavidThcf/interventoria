const express = require('express');
const path = require('path');
const http = require('http');


const app = express();
const port = process.env.PORT || 83;

app.use(express.static(path.join(__dirname,'dist')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'dist/index.html'));
});

const server = http.createServer(app);

server.listen(5000,()=>{
    console.log("server runing");
});


