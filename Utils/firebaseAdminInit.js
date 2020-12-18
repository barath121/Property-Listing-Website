const Cloud = require('@google-cloud/storage')
const path = require('path')
const util = require('util')
const { format } = util
const serviceKey = path.join(__dirname, './Firebase Credentials/keys.json')

const { Storage } = Cloud

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'santoshproperty-4b66f',
})

const gc = storage
const bucket = gc.bucket('gs://santoshproperty-4b66f.appspot.com')

module.exports.uploadFile = (file) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file
  const blob = bucket.file(originalname.replace(/ /g, "_"))
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

