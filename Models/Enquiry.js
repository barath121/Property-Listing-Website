const mongoose = require('mongoose');
const enquirySchema = mongoose.Schema({
email : {
    type : String,
    required : true
},
name : {
    type : String,
    required : true
},
contactno : {
    type : String,
    required : true
},
message : {
    type : String
},
contacted : {
    type : Boolean,
    default : false
}
},{
    timestamps: true,
})

const Enquiry = mongoose.model('Enquiry',enquirySchema);
module.exports = Enquiry;