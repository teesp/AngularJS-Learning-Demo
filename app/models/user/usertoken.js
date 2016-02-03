/**
 * Created by jinwyp on 2/2/2016.
 */


/**
 * Module dependencies
 */

var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
 // var mongooseTimestamps = require('mongoose-timestamp');

mongoose.Promise = Promise;

var validator = require('validator');
var moment = require('moment');

var config = require('config');
var tokenConfig = config.get('userlogin');

var jsonwebtoken = require("jsonwebtoken");

var TOKEN_EXPIRATION_SEC = 60 * 60 * 24 * tokenConfig.jwtTokenExpireDay; // 1 day
var TOKEN_EXPIRATION_SEC_RememberMe = 60 * 60 * 24 * tokenConfig.jwtTokenExpireDay * 6;
var TOKEN_EXPIRATION_DAY_RememberMe = tokenConfig.jwtTokenExpireDay * 6; // 1 day

var ValidatonError = require('../../errors/ValidationError');
var UnauthorizedAccessError = require('../../errors/UnauthorizedAccessError');



/**
 * Mongoose schema
 */




var UserTokenSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: 'User' },
    accessToken: { type: String, required: true },
    accessToken_iat : { type: Number },
    accessToken_exp : { type: Number },

    expireDate: { type: Date, required: true },

    ip: { type: String },
    userAgent: { type: String}


}, {
    toObject: { virtuals: false },
    toJSON: { virtuals: false },
    timestamps: true
});

/**
 * Mongoose plugin
 */









/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */






/**
 * Mongoose Schema Statics
 *
 * http://mongoosejs.com/docs/guide.html
 *
 */


var validation = {
    tokenNotFound : function (token){
        if (!token){
            throw new UnauthorizedAccessError(ValidatonError.code.token.tokenNotFound, "User Unauthorized, token not found", "X-Access-Token");
        }
    },

    tokenDecodeWrong : function (token){
        if (!token){
            throw new UnauthorizedAccessError(ValidatonError.code.token.tokenDecodeWrong, "User Unauthorized, token wrong", "X-Access-Token");
        }
    },
};


UserTokenSchema.statics.validation = validation;




UserTokenSchema.statics.createToken = function(user, req){

    var payload = {
        _id: user._id
    };

    var token  = jsonwebtoken.sign(payload, tokenConfig.jwtTokenSecret, {
        expiresIn: TOKEN_EXPIRATION_SEC
    });


    var newToken = {
        user: user._id,
        // username: user.username,
        // access: resultUser.access,

        accessToken: token,

        expireDate : moment().add(tokenConfig.jwtTokenExpireDay, 'days'),

        ip: req.ip,
        userAgent: req.get('User-Agent')

    };

    var decoded = jsonwebtoken.decode(token);
    newToken.accessToken_iat = decoded.iat;
    newToken.accessToken_exp = decoded.exp;

    return UserToken.create(newToken);
};






/**
 * Mongoose Schema Instance Methods
 *
 * Instances of Models are documents. Documents have many of their own built-in instance methods. We may also define our own custom document instance methods too.
 *
 * http://mongoosejs.com/docs/guide.html
 */




UserTokenSchema.methods.comparePassword = function (passw) {


};





/**
 * Register Model
 */

var UserToken = mongoose.model("UserToken", UserTokenSchema);
module.exports = UserToken;