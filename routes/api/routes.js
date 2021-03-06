var express = require('express');
var router = express.Router();
var http = require('http')
var OAuth = require('oauth').OAuth
var url = require('url')

var bodyParser = require('body-parser');
var Track = require('../../models/Track');
var environment = require('../../environment.json');
var Routes = {
    INSERT: '/insert',
    LOGIN: '/login',
    UPDATE: '/update',
    DELETE: '/delete',
    GETALL: '/getAll',
    UPDATE_ALL: '/updateAll',
    TRELLO_LOGIN: '/trelloAuth',
    TRELLO_CALLBACK: '/callback',
}


router.get(Routes.TRELLO_CALLBACK, function (req, res) {
    console.log(req.query);
    res.render('index')
});



router.get('/register', function (req, res) {
    console.log('registers')
    res.render('index')
});


router.get('/', function (req, res) {
    res.render('index')
});

router.route(Routes.TRELLO_LOGIN)
    .post(function (req, res) {
        const doc = {
            username: req.body.username,
            password: req.body.pwd,
        };
        const requestURL = "https://trello.com/1/OAuthGetRequestToken";
        const accessURL = "https://trello.com/1/OAuthGetAccessToken";
        const authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
        const appName = "Trello OAuth";

        const key = req.body.username;
        const secret = req.body.pwd;

        const loginCallback = `http://localhost:8000/callback`;
        const oauth_secrets = {};
        const oauth = new OAuth(requestURL, accessURL, key, secret, "1.0A", loginCallback, "HMAC-SHA1");

        oauth.getOAuthRequestToken(function(error, token, tokenSecret, results){
            oauth_secrets[token] = tokenSecret;
            res.send({url:`${authorizeURL}?oauth_token=${token}&name=${appName}`});
        });



        if (doc.username === environment.account.username && doc.password === environment.account.password) {
            res.send({authenticated: true, message: 'Successfully logged in!'});
        } else if (doc.username != '' && doc.password != '') {
            res.send({authenticated: false, message: 'Wrong username or password'});
        } else {
            res.send({authenticated: false, message: 'Please fill out the from'});
        }
    });


// INSERT NEW DATA
router.route(Routes.INSERT)
    .post(function (req, res) {
        var track = new Track();
        track.title = req.body.title;
        track.description = req.body.description;
        track.elapsed = req.body.elapsed;
        track.runningSince = req.body.runningSince;
        track.updateDate = req.body.updateDate;
        console.log(track)
        track.save(function (err, docsInserted) {
            if (err)
                res.send(err);
            res.send({id: track._id, codeName: 'Track successfully added!'});
        });
    })

// LOGIN
/*router.route(Routes.LOGIN)
    .post(function (req, res) {
        const doc = {
            username: req.body.username,
            password: req.body.pwd,
        };
        console.log(Routes.LOGIN);
        console.log(doc);
        console.log('*******************************');
        console.log('Only available dummy account: ');
        console.log(environment);
        if (doc.username === environment.account.username && doc.password === environment.account.password) {
            res.send({authenticated: true, message: 'Successfully logged in!'});
        } else if (doc.username != '' && doc.password != '') {
            res.send({authenticated: false, message: 'Wrong username or password'});
        } else {
            res.send({authenticated: false, message: 'Please fill out the from'});
        }
    });*/

//UPDATE THE DATA
router.route(Routes.UPDATE)
    .post(function (req, res) {
        const doc = {
            title: req.body.title,
            description: req.body.description,
            runningSince: req.body.runningSince,
            elapsed: req.body.elapsed,
            updateDate: req.body.updateDate
        };
        Track.update({_id: req.body._id}, doc, function (err, result) {
            if (err)
                res.send(err);
            res.send('Track successfully updated!');
        });
    });

//UPDATE All THE DATA
router.route(Routes.UPDATE_ALL)
    .post(function (req, res) {
        let errors = [];
        let responses = [];
        req.body.data.forEach(item => {
            const doc = {
                title: item.title,
                description: item.description,
                runningSince: item.runningSince,
                elapsed: item.elapsed,
                updateDate: new Date().toISOString()
            };
            Track.update({_id: item.id}, doc, function (err, result) {
                if (err)
                    errors.push(err);
                else
                    responses.push('Track successfully updated!');
            });
        });
        if (errors.length !== 0) {
            res.send(errors);
        } else {
            res.send(responses);
        }
    });

//REMOVE DATA
router.get(Routes.DELETE, function (req, res) {
    var id = req.query.id;
    Track.find({_id: id}).remove().exec(function (err, track) {
        if (err)
            res.send(err)
        res.send('Track successfully deleted!');
    })
});

//GET ALL DATA
router.get(Routes.GETALL, function (req, res) {
    var runningSinceRec = req.query.runningSince;
    var titleRec = req.query.title;
    var filters = [];
    if (runningSinceRec === 'null') {
        filters.push({runningSince: null});
    }
    if (titleRec) {
        filters.push({title: new RegExp(titleRec, 'i')});
    }
    if (filters.length === 0) {
        filters.push({});
    }
    Track.find({$and: filters}).limit(10).exec(function (err, tracks) {
        if (err)
            res.send(err);
        res.json(tracks);
    });
});
module.exports = router;