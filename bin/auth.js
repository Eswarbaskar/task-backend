var bcrypt = require('bcryptjs');
const saltRound = 10;

const hashpassword = async(password)=>{
    var salt =await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(password,salt)
}

const hashCompare = async(password,hashpassword)=>{
    return await bcrypt.compare(password,hashpassword)
}

module.exports={hashCompare,hashpassword}