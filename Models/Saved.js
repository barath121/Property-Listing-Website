const mongoose = require('mongoose');
const savedSchema = mongoose.Schema({
residentialID : { type: mongoose.Schema.Types.ObjectId, ref: 'Residential' },
commercialID : { type: mongoose.Schema.Types.ObjectId, ref: 'Commercial' },
customerID : {
    type :  mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
}
},{
    timestamps: true,
})

const Saved = mongoose.model('Saved',savedSchema);
module.exports = Saved;