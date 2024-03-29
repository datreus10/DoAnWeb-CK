const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    phone_number:{
        type: String,
        maxlength: 15
    },
    address:{
        type: String,
        maxlength: 100
    },
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minglength: 5
    },
    role:
    {
        type: String,
    },
    Confirmpassword: {
        type: String,
        minglength: 5
    },


})

// userSchema.pre('save', function (next) {
//     var user = this;
//     if (user.isModified('password')) {
//         console.log('password changed')
//         bcrypt.genSalt(saltRounds, function (err, salt) {
//             if (err) return next(err);

//             bcrypt.hash(user.password, salt, function (err, hash) {
//                 if (err) return next(err);
//                 user.password = hash
//                 next()
//             })
//         })
//     } else {
//         next()
//     }
// });

// userSchema.methods.comparePassword = function (plainPassword, cb) {
//     bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch)
//     })
// }

// userSchema.methods.generateToken = function (cb) {
//     var user = this;
//     var token = jwt.sign(user._id.toHexString(), 'secret')
//     var oneHour = moment().add(1, 'hour').valueOf();

//     user.tokenExp = oneHour;
//     user.token = token;
//     user.save(function (err, user) {
//         if (err) return cb(err)
//         cb(null, user);
//     })
// }

// userSchema.statics.findByToken = function (token, cb) {
//     var user = this;

//     jwt.verify(token, 'secret', function (err, decode) {
//         user.findOne({ "_id": decode, "token": token }, function (err, user) {
//             if (err) return cb(err);
//             cb(null, user);
//         })
//     })
// }

module.exports = mongoose.model('User', userSchema, 'User');