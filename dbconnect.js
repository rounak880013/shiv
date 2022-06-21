const mongoose=require('mongoose');
const db_link=""
mongoose.connect(db_link).then(function(){
    console.log('db_connect');
})
.catch(function(err){
    console.log(err);
})