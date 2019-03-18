const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('User', userSchema);
// TODO install mongoose-unique-validator and use it here as plugin for UserModel

module.exports = UserModel;