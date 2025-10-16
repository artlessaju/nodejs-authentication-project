const mongoose = require('mongoose')

const connectToDB = async()=>{
    try{

await mongoose.connect(process.env.MONGO_URL)
console.log('mongodb connected successfully');

    }
    catch(e){
console.log(e);
process.exit(1)
    }
}

module.exports = connectToDB;