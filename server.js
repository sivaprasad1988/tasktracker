const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");
const users = require("./routes/api/users");
const trello = require("./routes/api/trello");
const app = express();
app.use(
    bodyParser.urlencoded({
        urlencoded : false
    })
);
app.use(bodyParser.json());
const db = require('./config/keys').mongoURI;
mongoose.connect(db,{ useNewUrlParser: true }).
            then(() =>{ console.log("MongoDB successfully connected") }).
            catch((err) => {console.log(err) });
// Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);
app.use("/api/users", users);
app.use("/api/trello", trello);

const port = process.env.PORT || 1000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));