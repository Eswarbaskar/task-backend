const mongoose = require('mongoose')
const validator = require('validator')

const usersSchema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{
                type:String,
                required:true,
                lowercase:true,
                validate:(value)=>validator.isEmail(value)
            },
        password:{type:String,required:true},
        confirmpassword:{type:String,required:true},
        age:{type:String},
        mobile:{type:String,default:"000-000-0000"},
        dob:{type:Date},
        gender:{type:String},
        createdAt:{type:Date,default:Date.now()}
    },
    
)

const userDetalis = mongoose.model('users',usersSchema)

module.exports =  {userDetalis}