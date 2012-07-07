/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 15/06/12
 * Time: 4:55 PM
 * To change this template use File | Settings | File Templates.

 ObjectId = Schema.ObjectId,
 _id : ObjectId,
 var mongooseTypes = require("mongoose-types");
 var  Email = mongoose.SchemaTypes.Email,
 var Url = mongoose.SchemaTypes.Url;
 mongooseTypes.loadTypes(mongoose);
 , ex_bio: { type: String, select: false }
 , ex_location: { type: Schema.Types.Mixed, select: false }
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Add password: String
var UserSchema = new Schema({
    token: { type: String, default: '' }  //only for Facebook:,index:{unique:true}
    , fb_id: { type: String, default: '' }
    , username: { type: String }
    , first_name: String
    , middle_name: { type: String, default: '' }
    , last_name: String
    , gender: String
    , locale: String
    , timezone: Number
    , created_time: { type: Date, default: '' }
    , updated_time: { type: Date, default: '' }
    , birthday: { type: Date, default: null }
    , email: { type: String, default: ''}  //Email
    , picture: { type: String, default: '' }
    , role_id: { type: String, default: '' }
    , third_party: { type: String, default: '' }
    , third_party_id: { type: String, default: '' }
    , password: { type: String, default: '' }
    , ex_session: {}   // store session info.
    , ex_token: {}
    , ex_link: String //Url
    , ex_verified: { type: Boolean, default: true }
});

UserSchema.static('recent', function(days, callback) {
   days = days || 1;
   this.find({data: {$gte: Date.now()-1000*60*60*24*days}}, callback);
});

UserSchema.virtual('shortBody').get(function() {
    return this.body.substring(0,50);
}).set(function(val) {
	console.log(val);
});

UserSchema.virtual('name').get(function() {
   return this.first_name + ' ' + this.last_name;
});

var User = mongoose.model('User', UserSchema);

exports.UserSchema = UserSchema;
