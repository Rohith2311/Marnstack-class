const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/mern-calss",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("succesfully connected")
}).catch((e)=>{
    console.log("couldn't connect db",e)
})