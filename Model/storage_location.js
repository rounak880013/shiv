const mongoose=require('mongoose');
const connect=require('../dbconnect');

const location_master=new mongoose.Schema({
    file_name:{
        type:String,
        required:true
    },
    file_location:{
        type:String,
        required:true
    }
})
const location_master_data=mongoose.model('location_master_data',location_master);
module.exports=location_master_data;