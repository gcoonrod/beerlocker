var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-node');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function(callback) {
    var user = this;

    if (!user.isModified('password')) {
        return callback();
    }

    bcrypt.genSalt(5, function(error, salt) {
        if (error) {
            return callback(error);
        }

        bcrypt.hash(user.password, salt, null, function(error, hash) {
            if (error) {
                return callback(error);
            }

            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(error, isMatch){
        if (error) {
            return callback(error);
        }

        callback(null, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);
