'use strict';

const pageSize = 16;
const Inert = require('inert');
const Path = require('path');
var Tweet = require("./tweet.js");
var mongoose = require('mongoose');
var isNumeric = require('isnumeric');
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

server.route({
    method: 'GET',
    path: '/api/tweets',
    handler: function (req, reply) {
        console.log("/api/tweets");

        var forward = req.query.forward;// || new Date("01/01/1900");
        var back = req.query.back;// || new Date("01/01/1900");
        var initialPage = !(forward || back);

        if (forward && isNumeric(forward )){
            forward = parseInt( forward );
        }

        if (back && isNumeric( back )){
            back = parseInt( back );
        }

        var tweets = {};

        if (initialPage) {
            tweets = Tweet.find({ deletedBy: null }).sort({pageIndex: 'descending'}).limit(pageSize);
        } else {
            if (forward) {
                var newPos = forward - pageSize;
                tweets = Tweet.find({ 'pageIndex': { $lt: newPos }, deletedBy: null }).sort({pageIndex: 'descending'}).limit(pageSize);
            } else {
                var newPos = back + pageSize;
                tweets = Tweet.find({ 'pageIndex': { $lt: newPos }, deletedBy: null }).sort({pageIndex: 'descending'}).limit(pageSize);
            }
        }

        reply(tweets);
    }
});

server.route({
    method: 'DELETE',
    path: '/api/tweet',
    handler: function (req, reply) {


        Tweet.findOne({ 'tweetId': req.payload.tweetId }, function (error, tweet) {
            tweet.deletedBy = req.payload.ip;
            tweet.save(function () {

            });
        });

        reply("success");
    }
});



server.route({
    method: 'GET',
    path: '/api',
    handler: function (req, reply) {
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

