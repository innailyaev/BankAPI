const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port =8000;
const usersRoute = require('./routes/users.route');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/users',usersRoute);

app.listen(port,()=>{
    console.log(`application start at ${port}`)
})