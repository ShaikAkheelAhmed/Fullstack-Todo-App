const express = require('express')
const app = express()
const port = 3001
const config = require('./config/dbConnection')
const bodyparser = require('body-parser')
const userRoute = require('./routes/userRouter')
const taskRoute = require('./routes/taskRouter')
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());




app.get('/', (req, res) => {
    res.send('hello shaik')
})



app.use('/user',   userRoute)


app.use('/task', taskRoute)


app.listen(port, () => {
    console.log(`The server is running on port ${port}`)
})