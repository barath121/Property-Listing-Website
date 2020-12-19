const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
email : {
    type : String,
    required : true
},
phone : {
    type : Number,
    required : true,
    validate: {
        validator: function(v) {
          return /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(v);
        },}
},
name : {
    type : String,
    required : true
},
password : {
    type : String,
    required : true
}
},{
    timestamps: true,
})