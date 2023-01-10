var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
const secretkey = 'qwerrtyuiijsbbhabnndbggch'
const saltRound = 10;

/* bcrypt.js */

const hashpassword = async (password) => {
    var salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(password, salt)
}

const hashCompare = async (password, hashedpassword) => {
    return await bcrypt.compare(password, hashedpassword)
}

/* jsonwebtoken */

const creatToken = async ({ email, name }) => {
    let token = await jwt.sign({ email, name }, secretkey, { expiresIn: '5m' })
    return token
}

const decodeToken = async(token)=>{
    let data = await jwt.verify(token,secretkey)
    return data
}

const middle = async (req,res,next) => {
    let token = req.headers.authorization.split(' ')[1];
    let data = await jwt.decode(token)
    if ((Math.round(+Date.now() / 1000)) <= data.exp) {
        next()
    }
    else {
        res.send({
            statusCode: 401,
            message: "Token Expired"
        })
    }
}

module.exports = { hashCompare, hashpassword,decodeToken,creatToken,middle}