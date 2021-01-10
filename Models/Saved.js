const mongoose = require('mongoose');
const savedSchema = mongoose.Schema({
propertyID : {
    type : String,
    required : true
},
customerID : {
    type : String,
    required : true
}
},{
    timestamps: true,
})

const Saved = mongoose.model('Saved',savedSchema);
module.exports = Saved;