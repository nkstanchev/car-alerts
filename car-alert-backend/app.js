const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyRoleOrSelfAlert = require('./verify-role');

// get config vars
dotenv.config();

app.use(express.urlencoded());
app.use(express.json());

app.get('/', function (req, res) {
  res.send('hello world')
})
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'car-alerts';

// Endpoints
app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/alerts', getAlerts);
app.post('/alert', authenticateToken, createAlert);
app.get('/alert/:id', authenticateToken, verifyRoleOrSelfAlert('admin'), getAlertByID);
app.put('/alert/:id', authenticateToken,  verifyRoleOrSelfAlert('admin'), updateAlert);
app.delete('/alert/:id', authenticateToken,  verifyRoleOrSelfAlert('admin'), deleteAlert);
app.get('/users', authenticateToken, verifyAdmin, getUsers);
app.delete('/user/:id', authenticateToken, verifyAdmin, deleteUser);
app.get('/user/:id', authenticateToken, verifyAdmin, getUserByID);
app.put('/user/:id', authenticateToken, verifyAdmin, updateUser);

MongoClient.connect(url, function(err, client) {
    app.locals.db = client.db('car-alerts');;
});

// Start server
app.listen(3000)

function loginUser(req, res) {
  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection('users');
    collection.findOne({'username': req.body.username}).then(function(user) {
      if (user) {
        if(bcrypt.compareSync(req.body.password, user.password)) {
          // access config var
          process.env.TOKEN_SECRET;
          const token = generateAccessToken({ username: req.body.username, role: user.role, id: user._id });
          res.json(token);
          res.send();
        } else {
          console.log('password dont match')
          // Passwords don't match
          res.status(403);
          res.send({'message':'Invalid username or password'})
        }
      }
    }).catch(function(error) {
        console.log('error is', error)
        res.status(403);
        res.send({'message':'Error processing login request'})
    });
  });
  client.close();
}

function generateAccessToken(data) {
  return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

function registerUser(req, res) {
  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection('users');

    collection.findOne({'username': req.body.username}).then(function(user) {
      if(user) {
        console.log('found with this username')
          res.status('500');
          res.send({message:'Error: Username already in use'});
      } else {
          collection.findOne({'email': req.body.email}).then(function(user) {
            if(user) {
              console.log('found with this email')
                res.status('500');
                res.send({message:'Error: Email already in use'});
            } else {
                    const newUser = 
              {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 10),
                email: req.body.email,
                role: req.body.role,
              };
              console.log(newUser, 'newUser is')
              collection.insertOne(
                  newUser
              , function(err, result) {
                  if (err) {
                    res.status(500).send({message:'Error creating user'});
                  }
                  // add logic for error status code
                  console.log("Inserted 1 document into the collection", result.insertedId);
                  res.set('Location', 'post/'+result.insertedId)
                      res.status(201)
                  console.log(res.headers);
                  res.send(JSON.parse('{}'))
                  
              });
                }
              }).catch(function(err) {
                console.log(err)
              });
            }
          }).catch(function(err) {
            console.log(err)
          });
  });
  client.close();
}

function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token
  jwt.verify(token, process.env.TOKEN_SECRET, function(err, user) {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}

function getUsers(req, res) {
  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection('users');
    collection.find().toArray(function(err, result) {
      if (err) {
        res.status(500).send({'message': "Error fetching users"});
      };
      console.log(result);
      res.status(200).send(result);
    });
  });
  client.close();
}

function getAlerts(req, res) {
  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection('alerts');
    collection.find().toArray(function(err, result) {
      if (err) {
        res.status(500).send({'message': "Error fetching alerts"});
      };
      console.log(result);
      res.status(200).send(result);
    });
  });
  client.close();
}


function deleteUser(req, res) {
  // use jtw auth
  const client = new MongoClient(url);
  client.connect(function(err) {
    const db = client.db(dbName);
    const collection = db.collection('users');
    var myquery = { _id: ObjectId(req.params.id) };
    collection.deleteOne(myquery, function(err, user) {
        if (err) {
          res.status(500).send({'message': "Error deleting user"})
        }
        console.log(user, "was deleted");
        res.send();
        
      });
    client.close();
  });
}

function getUserByID(req, res) {
  const client = new MongoClient(url);
  client.connect(function(err) {
    const db = client.db(dbName);
    const collection = db.collection('users');
    var myquery = { _id: ObjectId(req.params.id) };
    collection.findOne(myquery, function(err, user) {
        if (err) {
          res.status(500).send({'message': "Error getting user by id"})
        }
        console.log("found user");
        console.log(user);
        res.send(user);
    });
    client.close();
  });
}

function updateUser(req, res) {
  // check for auth
  const client = new MongoClient(url);
  client.connect(function(err) {
    const db = client.db(dbName);
    const collection = db.collection('users');
    collection.updateOne(
      {"_id": ObjectId(req.params.id)}, 
      { $set: {role: req.body.role} }, 
      function(err, user) {
        if (err) {
          res.status(500).send({'message': "Error updating user"})
        }
        console.log("updated");
        console.log(user);
        res.set('Location', 'user/'+req.params.id)
        res.send(user);
        client.close()
    });
  });
}

function createAlert(req, res) {
  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection('alerts');
    const newAlert = 
    {
      x: req.body.x,
      y: req.body.y,
      type: req.body.type,
      user_id: req.body.user_id
    };
    if (newAlert.type == 'camera') {
      newAlert.speed = req.body.speed
    } else if (newAlert.type == 'toll') {
      newAlert.price = req.body.price;
    } else if (newAlert.type == 'accident') {
      newAlert.info = req.body.info
    } else if (newAlert.type == 'jam') {
      newAlert.expected_delay = req.body.expected_delay;
    }
    console.log(newAlert, 'newAlert is')
    collection.insertOne(
        newAlert
    , function(err, result) {
        if (err) {
          res.status(500).send({message: "Error creating alert"})
        }
        console.log("Inserted 1 alert into the collection", result.insertedId);
        res.set('Location', 'alert/'+result.insertedId)
            res.status(201)
        res.send()
    });
  });
  client.close();
}
function getAlertByID(req, res) {
  const client = new MongoClient(url);
  client.connect(function(err) {
    const db = client.db(dbName);
    const collection = db.collection('alerts');
    var myquery = { _id: ObjectId(req.params.id) };
    collection.findOne(myquery, function(err, alert) {
        if (err) {
          res.status(500).send({'message': "Error getting alert by id"})
        }
        console.log("found alert");
        console.log(alert);
        res.send(alert);
    });
    client.close();
  });
}
function updateAlert(req, res) {
  // check for auth
  const client = new MongoClient(url);
  client.connect(function(err) {
    const db = client.db(dbName);
    const collection = db.collection('alerts');
    var updateQuery = {}
    if (req.body.type == 'camera') {
      updateQuery = { $set: {speed: req.body.speed} }
    } else if (req.body.type == 'toll') {
      updateQuery = { $set: {price: req.body.price} }
    } else if (req.body.type == 'accident') {
      updateQuery = { $set: {info: req.body.info} }
    } else if (req.body.type == 'jam') {
      updateQuery = { $set: {expected_delay: req.body.expected_delay} }
    }
    collection.updateOne(
      {"_id": ObjectId(req.params.id)}, 
      updateQuery, 
      function(err, alert) {
        if (err) {
          res.status(500).send({'message': "Error updating alert"})
        }
        console.log("updated");
        console.log(alert);
        res.send();
        client.close()
    });
  });
}

function deleteAlert(req, res) {
  // use jtw auth
  const client = new MongoClient(url);
  client.connect(function(err) {
    const db = client.db(dbName);
    const collection = db.collection('alerts');
    var myquery = { _id: ObjectId(req.params.id) };
    collection.deleteOne(myquery, function(err, alert) {
        if (err) {
          res.status(500).send({'message': "Error deleting alert"})
        }
        console.log(alert, "was deleted");
        res.send();
        
      });
    client.close();
  });
}

function verifyAdmin(req, res, next) {
    const db = req.app.locals.db;
    if (req.user.role == 'admin') {
        next();
    } else {
      next({ status: 403, message: `Not enough privilegies for this operation.` }); //Error
    }
  }