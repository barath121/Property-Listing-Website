const mongoose = require('mongoose');
const savedSchema = mongoose.Schema({
propertyID : { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
commercialID : { type: mongoose.Schema.Types.ObjectId, ref: 'Commercial' },
customerID : {
    type : String,
    required : true
}
},{
    timestamps: true,
})

const Saved = mongoose.model('Saved',savedSchema);
module.exports = Saved;