const mongoose = require('mongoose');
const savedSchema = mongoose.Schema({
residentalID : { type: mongoose.Schema.Types.ObjectId, ref: 'Residental' },
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