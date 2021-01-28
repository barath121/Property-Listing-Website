const Cloud = require('@google-cloud/storage')
const path = require('path')
const util = require('util')
const { format } = util

const { Storage } = Cloud

let serviceKey = path.join(__dirname, './Firebase Credentials/keys.json')
let storage = new Storage({
keyFilename: serviceKey,
projectId: process.env.FBProjectId,
})
let gc = storage
let bucket = gc.bucket(process.env.FBStorageBucket)
let fburl = process.env.FirebaseURL;

if(process.env.NODE_ENV == 'prod'){
  serviceKey = path.join(__dirname, './Firebase Credentials/prodkeys.json')
  storage = new Storage({
    keyFilename: serviceKey,
    projectId: process.env.FBProjectProdId,
  })
  gc = storage
  bucket = gc.bucket(process.env.FBProdStorageBucket)
  fburl = process.env.FirebaseProdURL;
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
