/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 05/06/12
 * Time: 4:02 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://pm_admin:pech0nka@flame.mongohq.com:27039/pm_test');
//var db = mongoose.createConnection('mongodb://pm_admin:pech0nka@flame.mongohq.com:27039/pm_test');

var mongooseTypes = require("mongoose-types");
mongooseTypes.loadTypes(mongoose);

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Email = mongoose.SchemaTypes.Email;

var fb = new Schema({
    _id : ObjectId,
    username: String,
    first_name: String,
    middle_name: String,
    last_name: String,
    gender: String,
    locale: String,
    timezone: Number,
    created_time: Date,
    updated_time: Date,
    birthday: Date,
    email: Email,
    picture: String,
    role_id: String,
    third_party: String,
    third_party_id: String
});

var MyModel = mongoose.model('fb', fb);

var instance = new MyModel();

instance.username = "The user's username, alies which publicly visible - now";
instance.first_name = "The user's first name";
instance.middle_name = "The user's middle name";
instance.last_name = "The user's last name";
instance.gender = "The user's gender: female or male";
instance.locale = "The user's locale";
instance.timezone =  1234567890;
instance.created_time =  '01/01/2012';
instance.updated_time = '01/01/2012';
instance.birthday = '01/01/2012';
instance.email = 'test@peoplemelt.com';
instance.picture = "The URL of the user's profile pic";
instance.role_id = "User's role id (Moderator, admin, angel ....)";
instance.third_party = "Name of party (facebook, twitter, google ..)";
instance.third_party_id = "unique identifier for the user`s of third party";


instance.save(function(err) {
    //
});