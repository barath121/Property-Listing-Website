const mongoose = require('mongoose');
const savedSchema = mongoose.Schema({
propertyID : { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
customerID : {
    type : String,
    required : true
}
},{
    timestamps: true,
})

const Saved = mongoose.model('Saved',savedSchema);
module.exports = Saved;