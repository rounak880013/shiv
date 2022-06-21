const express = require("express");
// I have uised multer to manage form data
const multer  = require('multer');
// for managing files
var fs = require('fs');
// importing model used for data storage
const location_master_data=require('./Model/storage_location');
const app=express();
app.use(express.json());
let port = process.env.PORT || 8000;
app.listen(port,function(){
    console.log(`server is listening on port ${port}`);
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

// this route is to push files on to the server
app.post('/', upload.array('file'), (req, res) =>{
    // console.log(req)
    location_master_data.create({
        file_name:req.body.filename,
        file_location:"/uploads/"+req.files[0].filename
    }).then((ans) => {
        res.status(200);
        res.send("Document inserted");
    }).catch((err) => {
        res.status(200);
        res.send("please try again");
        console.log(err.Message);
    })
})

// this route is to delete files
app.post('/delete', async (req, res) =>{
    try{
        const user= await location_master_data.findOne({"file_name":req.body.filename});
        fs.unlink(`.${user.file_location}`,function(err){
            if(err){
                res.status(200);
                res.send("something went wrong");
                return console.log(err);
            }
            res.status(200);
            res.send("file deleted successfully");
        }); 
        location_master_data.deleteOne({"file_name":req.body.filename})
    }
    catch(error){
        console.error(error.message);
    }
})

// this route is to read file
app.post('/read', async (req, res) =>{
    try{
        const user= await location_master_data.findOne({"file_name":req.body.filename});
        console.log(user);

        if(user==null){
            res.status(200);
            res.send("file do not exists");
        }
        else{
            res.status(200);
            res.sendFile(`.${user.file_location}`,{ root: '.' });
        }
    }
    catch(e){
        console.log(e);
    }
})

// this route is toi update any file
app.post('/update',upload.array('file'),async (req, res) =>{
    try{
        const user= await location_master_data.findOne({"file_name":req.body.filename});
        fs.unlink(`.${user.file_location}`,function(err){
            if(err){
                res.status(200);
                res.send("something went wrong");
                return console.log(err);
            }
        }); 
        location_master_data.updateOne({"file_name":req.body.filename},{
            $set:{
                file_location:"/uploads/"+req.files[0].filename
            }
        })
        res.status(200);
        res.send("file is updated");
    }
    catch(error){
        console.error(error.message);
    }
})