const express = require('express');
const morgan = require("morgan");
const mongoose = require('mongoose');
const router = require('./api/v1/routes/authRouter');
const { PORT, MODE, DATABASE } = require("./config");

const app = express();
app.use(morgan("dev"));
app.use(express.json());


// dead end
app.use((req,res) => {
    res.status(404).json({ message: 'verb not supported'}).end();
});


// database connection
mongoose.connect(DATABASE, {
    useNewUrlParser:true,
    useUnifiedTopology:true

}).then(()=>{
    console.log(`connection successful`);

}).catch((err)=>console.log(`no connection`, err)); 

app.get("/ping", (req, res) => {
    res.status(200).send("Server running...");
});


// routes
app.use("/", router);


app.listen(PORT, () => {
    console.log(`Server running in ${MODE} at port no. ${5000}`);
});
