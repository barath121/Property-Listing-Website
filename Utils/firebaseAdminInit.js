const Cloud = require('@google-cloud/storage')
const path = require('path')
const util = require('util')
const fs = require("fs")
const { format } = util
const { Storage } = Cloud
let gc
let bucket
let fburl 
let dir = path.join(__dirname,'./Firebase Credentials');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
if(process.env.NODE_ENV == 'prod'){
  let prodKeyJSON = Buffer.from(process.env.FirebaseProdKey, 'base64');
  fs.writeFile("./Firebase Credentials/keys.json",prodKeyJSON.toString(),(err)=>{
  let serviceKey = path.join(__dirname, './Firebase Credentials/prodkeys.json')
  let storage = new Storage({
    keyFilename: serviceKey,
    projectId: process.env.FBProjectProdId,
  })
  gc = storage
  bucket = gc.bucket(process.env.FBProdStorageBucket)
  fburl = process.env.FirebaseProdURL;
  });
}
else{
let devKeyJSON = Buffer.from(process.env.FirebaseDevKey, 'base64');
fs.writeFile(dir+"/keys.json",devKeyJSON.toString(),(err)=>{
  let serviceKey = path.join(__dirname, './Firebase Credentials/keys.json')
  let storage = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.FBProjectId,
  })
  gc = storage
  bucket = gc.bucket(process.env.FBStorageBucket)
  fburl = process.env.FirebaseURL;
});
}

module.exports.uploadFile = (file,imageid,i) => new Promise((resolve, reject) => {
  const { originalname, buffer ,fieldname} = file
  
  const blob = bucket.file(imageid+'/'+fieldname+'/'+i+originalname.replace(/ /g, "_"));
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', (err) => {
    console.log(err)
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)

})

module.exports.deleteFile = async(images) =>{
  images.forEach(image=>{
    bucket.file(image.split("https://storage.googleapis.com/"+fburl).pop()).delete();
  })
}
