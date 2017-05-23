'use strict';

const Inert = require('inert');
const Path = require('path');
const extConfig = require('./config/config.json');
var Tweet = require("./tweet.js");
var port = process.env.PORT || 8080; // set our port



const Hapi = require('hapi');
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});
server.connection({ port: port });

server.register(Inert, () => { });

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});

var callback = function (labels) {
    console.log("callback called");
    console.log(labels);

}

server.route({
    method: 'GET',
    path: '/api/tweets',
    handler: function (req, reply) {
        console.log("/api/tweets");

        var tweets = Tweet.find({ deletedBy: null }).limit(16);

        reply(tweets);
    }
});

server.route({
    method: 'DELETE',
    path: '/api/tweet',
    handler: function (req, reply) {
        console.log("/api/tweet:DELETE");

        Tweet.findOne({ 'tweetId': req.payload.tweetId }, function (error, tweet) {
            tweet.deletedBy = req.payload.ip;
            tweet.save(function () {
                console.log('saved');
            });
        });

        reply("success");
    }
});



server.route({
    method: 'GET',
    path: '/api',
    handler: function (req, reply) {
        console.log("/api");
        var resp = {
            url: '/api',
            status: 20
        }
        reply(resp);
    }
});

server.register(
    {
        register: require('inert')
    },
    function (err) {
        if (err) throw err

        server.start(function (err) {
            console.log('Server started at: ' + server.info.uri)
        })
    }
)

