/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const port = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
var users = [];

app.use(express.json());
app.post("/signup", (req, res) => {
  var user = req.body;
  let userAlreadyExists = false;
  for (var i = 0; i<users.length; i++) {
    if (users[i].email === user.email) {
        userAlreadyExists = true;
        break;
    }
  }
  if (userAlreadyExists) {
    res.sendStatus(400);
  } else {
    users.push(user);
    res.status(201).send("Signup successful");
  }
});

app.post("/login", (req, res) => {
  var user = req.body;
  let userFound = null;
  for (var i = 0; i<users.length; i++) {
    if (users[i].email === user.email && users[i].password === user.password) {
        userFound = users[i];
        break;
    }
  }

  if (userFound) {
    res.json({
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        email: userFound.email
    });
  } else {
    res.sendStatus(401);
  }
});


  

app.get('/data', (req, res) => {
  // Fetch arrays of emails and passwords from request headers
  const emailsHeader = req.headers['x-emails'];
  const passwordsHeader = req.headers['x-passwords'];

  console.log('Received headers:', emailsHeader, passwordsHeader);
  // Check if headers exist
  if (!emailsHeader || !passwordsHeader) {
    return res.status(400).json({ error: 'Bad Request: Missing headers' });
  }

  const emails = emailsHeader.split(',');
  const passwords = passwordsHeader.split(',');

  // Array to store matched users
  const matchedUsers = [];

  // Iterate over each set of credentials
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i].trim();
    const password = passwords[i].trim();

    // Find the user with the matching email and password
    
    const user = users.find(user => user.email === email && user.password === password);

    console.log('Matching user:', user);

    // If a user is found, add them to the matchedUsers array
    if (user) {
      matchedUsers.push({
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
  }

  // If no users are found, return a 401 Unauthorized response
  if (matchedUsers.length === 0) {
    return res.status(401).json({ error: 'Unauthorized: Invalid email or password' });
  }

  // Return the protected data for matched users
  return res.status(200).json({ users: matchedUsers });
});
app.get("/all", (req,res) => {
  res.send(users);
})

function started(){
  console.log('Example app listing on port ${port}')
}

app.listen(port, started)


module.exports = app;
