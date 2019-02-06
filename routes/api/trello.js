const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const OAuth = require('oauth').OAuth;
var Trello = require("trello");


// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/getCardDetails", async (req, res) => {
    const doc = {
        username: req.body.username,
        password: req.body.pwd,
    };
    const requestURL = "https://trello.com/1/OAuthGetRequestToken";
    const accessURL = "https://trello.com/1/OAuthGetAccessToken";
    const authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
    const appName = "Trello OAuth";

    const key = req.body.email;
    const secret = req.body.password;
    const userid = req.body.userid;

    const loginCallback = `http://localhost:3000/callback`;
    const oauth_secrets = {};
    const oauth = await  new OAuth(requestURL, accessURL, key, secret, "1.0A", loginCallback, "HMAC-SHA1");

    oauth.getOAuthRequestToken(function (error, token, tokenSecret, results) {
        if (error) {
            let errors = {};
            return res.status(400).json({notoken: 'OAuth consumer did not supply its key'});
        } else {

            User.findOneAndUpdate({_id: userid}, {tokenSecret: tokenSecret,}).then((updatedDoc) => {
                console.log("RESULT: " + updatedDoc);
                res.json({url: `${authorizeURL}?oauth_token=${token}&name=${appName}`});
            }).catch((err) => {
                res.send(err)
            });

        }
    });

});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/getAccessTokens", async (req, res) => {

    const key = '51747a648c4cfeed9994aa2bd019abff';
    const secret = '31e3b863f771241e95eb7c3554de9c5e5e9708ff45b8e940a6f51e82efa6bac9';
    const myListId = '5be944b3c6db6a8cec28e0e5';


    const trello = new Trello(key, secret);
    const cardsPromise = trello.getCardsOnList(myListId);
    cardsPromise.then((cards) => {
        res.json({data: cards});
    });

});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation

    const {errors, isValid} = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email}).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({emailnotfound: "Email not found"});
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };

                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({passwordincorrect: "Password incorrect"});
            }
        });
    });
});

module.exports = router;