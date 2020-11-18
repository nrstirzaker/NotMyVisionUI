const pageSize = 16;
const express = require('express');
//const Tweet = require("./tweet.js");
const cors = require('cors');
const isNumeric = require('isnumeric');
const port = process.env.PORT || 8080; // set our port

const app = express();
app.use(cors());
app.use(express.static('public'))


app.get('/api/tweets', (req, res) => {

    console.log("/api/tweets");

    let forward = req.query.forward;// || new Date("01/01/1900");
    let back = req.query.back;// || new Date("01/01/1900");
    const initialPage = !(forward || back);

    if (forward && isNumeric(forward)) {
        forward = parseInt(forward);
    }

    if (back && isNumeric(back)) {
        back = parseInt(back);
    }

    const tweets = {};

    if (initialPage) {
        //tweets = Tweet.find({deletedBy: null}).sort({pageIndex: 'descending'}).limit(pageSize);
    } else {
        if (forward) {
            let newPos = forward - pageSize;
            //tweets = Tweet.find({'pageIndex': {$lt: newPos}, deletedBy: null}).sort({pageIndex: 'descending'}).limit(pageSize);
        } else {
            let newPos = back + pageSize;
            //tweets = Tweet.find({'pageIndex': {$lt: newPos}, deletedBy: null}).sort({pageIndex: 'descending'}).limit(pageSize);
        }
    }

    return tweets;

});

app.delete('/api/tweet', (req, res) => {


    // Tweet.findOne({'tweetId': req.payload.tweetId}, function (error, tweet) {
    //     tweet.deletedBy = req.payload.ip;
    //     tweet.save(function () {
    //
    //     });
    // });

    return "success";

});


app.get('/api', (req, res) => {

    const resp = {
        url: '/api',
        status: 20
    }
    return (resp);

});

let server = app.listen(port, () => {
    console.log('Server running at:', server.address().port);
})








