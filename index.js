const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
// const port =8000;
const usersRoute = require('./routes/users.route');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api/users',usersRoute);

app.get('/',(req,res)=>{
    res.json({success : 'Bank API'})
})


// app.listen(port,()=>{
//     console.log(`application start at ${port}`)
// })
app.listen(process.env.PORT || 5000);
