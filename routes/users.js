var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose')
var { dbName, dbUrl, mongodbClient, mongodb } = require('../dbconfig')
const client = new mongodbClient(dbUrl);
var { hashCompare, hashpassword,creatToken,middle,decodeToken } = require('../bin/auth');
// var {useDetails}=require('../dbschema')

// mongoose.connect(dbUrl);

router.get('/',middle,async(req, res)=> {
  await client.connect();
  try {
    let token = req.headers.authorization.split(' ')[1];
    let data = await decodeToken(token)
    
    const db = await client.db(dbName);
    let user = await db.collection('users').findOne({email:data.email,name:data.name});
    
    if(user)
    {
        let users = await db.collection('users').find().toArray()
        console.log(users);
        res.send({
          statusCode: 200,
          users
        })
    }
    else
    {
      res.send({
        statusCode: 401,
        message:'Unauthorized'
      })
    }
  } catch (error) {
    console.log(error)
    res.send({ 
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
});

router.get('/:id', async (req, res) => {
  await client.connect();
  try {
    let db = await client.db(dbName);
    let user = await db.collection('users').findOne({_id:mongodb.ObjectId(req.params.id)})
    res.send({
      statusCode: 200,
      data: user
    })

  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 400,
      message: "bad requst"
    })
  }
  finally {
    client.close()
  }
})

/* sign up */
router.post('/sign-up', async (req, res) => {
  await client.connect();
  try {
    const db = await client.db(dbName);
    const user = await db.collection('users').find({ email: req.body.email }).toArray()
    if (user.length === 0) {
      if (user.password === user.confirmPassword) {
        req.body.password = await hashpassword(req.body.password);
        let user = { ...req.body, age: '', dob: '', mobile: '', gender: '' }
        
        let users = await db.collection('users').insertOne(user);

        res.send({
          statusCode: 200,
          message: "User Added Successfully"
        })
      }
      else {
        res.send({
          statusCode: 400,
          message: "confirmpassword not match"
        })
      }
    }
    else {
      res.send({
        statusCode: 400,
        message: "User already exists,kindly login"
      })
    }

  } catch (error) {
    console.log(error)
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
  finally {
    client.close()
  }
});

// login

router.post('/login', async (req, res) => {
  await client.connect();
  try {
    const db = await client.db(dbName);
    const user = await db.collection('users').find({ email: req.body.email }).toArray()
    if (user.length === 1) {
      let hashResult = await hashCompare(req.body.password, user[0].password)
      if (hashResult) {
           let token = await creatToken({
            email:user[0].email,
            name:user[0].name
           })
        res.send({
          statusCode: 200,
          message: "User Logged in Successfully",
          token
        })
      }
      else {
        res.send({
          statusCode: 401,
          message: "correct your password"
        })
      }
    }
    else {
      res.send({
        statusCode: 401,
        message: "User Does Not Exist"
      })
    }



  } catch (error) {
    console.log(error)
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
  finally {
    client.close()
  }
});



router.put('/update/:id', async(req, res) => {
  await client.connect();
  try {
    let db = await client.db(dbName);
    const obj = req.body;
    delete obj._id
    
    let user = await db.collection('users').updateOne({ _id:mongodb.ObjectId(req.params.id) }, { $set: obj  })
    res.send({
      statusCode: 200,
      message: "Successfully Added",
      user
    })

  } catch (error) {
    console.log(error)
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })

  }
  finally {
     client.close()
  }
})


router.delete('/delete/:id', async(req, res) => {
  await client.connect();
  try {
    let db = await client.db(dbName);
    await db.collection('users').deleteOne({ _id:mongodb.ObjectId(req.params.id) })
    let user = await db.collection('users').find().toArray()
    res.send({
      statusCode: 200,
      message: "Deleted Successfully",
      user
    })

  } catch (error) {
    console.log(error)
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })

  }
  finally {
     client.close()
  }
})  


module.exports = router;
