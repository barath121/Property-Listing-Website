const mongoose = require('mongoose');
const PropertySchema = mongoose.Schema({
propertyType : {
    type : String,
    enum : ['House','Rent','PG','Plot','Office'],
    required : true,
},

});

const Property = mongoose.model('Property',PropertySchema);
module.exports = Property;