let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  nickname: String,
  email: String,
  password: String,
  avatarUrl: String
});

let User = mongoose.model('User', userSchema);

module.exports = User;
