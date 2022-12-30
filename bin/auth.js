var bcrypt = require('bcryptjs');
const saltRound = 10;

const hashpassword = async(password)=>{
    var salt =await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(password,salt)
}

const hashCompare = async(password,hashedpassword)=>{
    return await bcrypt.compare(password,hashedpassword)
}

module.exports={hashCompare,hashpassword}