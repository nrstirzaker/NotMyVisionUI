var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var appConfig = require('./AppConfig.js');
mongoose.connect(appConfig.getMongoUrl());

var imageSizeSchema = new Schema({

        thumb: {
          h: Number,
          resize: String,
          w: Number
        },
        large: {
          h: Number,
          resize: String,
          w: Number
        },
        medium: {
          h: Number,
          resize: String,
          w: Number
        },
        small: {
          h: Number,
          resize: String,
          w: Number
        }

});

var ImageSize = mongoose.model('Child',imageSizeSchema);

mongoose.model['ImageSize'] = ImageSize;

var tweetSchema = new Schema({

        id : {type : String, required: true, unique: true},
        tweetId : String,
        senderHandle : String,
        mediaUrl : String,
        sizes: [mongoose.model["ImageSize"].schema],
        tweetCreatedAt : Date,
        deletedBy : String,
        text : String,
        createdAt : Date,
        updatedAt : Date

});




tweetSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updatedAt = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.createdAt)
    this.createdAt = currentDate;

  next();
});

var Tweet = mongoose.model('Tweet', tweetSchema);
mongoose.model['Tweet'] = Tweet;

// make this available to our users in our Node applications
module.exports = Tweet;