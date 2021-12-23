'use strict';

const AWS = require('aws-sdk');
const sharp = require('sharp');

const S3 = new AWS.S3()

module.exports.hello = async ({ Records: records}, context) => {
  try {
    Promise.all(records.map(async record => {

      const { key } = record.s3.object

      const image = await S3.getObject({
        Bucket: ProcessingInstruction.env.bucket,
        Key: key
      }).promise();

      const optimized = await sharp(image.body)
        .resize(1280, 720, { fit: 'inside', withoutEnlargement: true})
        .toFormat('jpeh', { progressive: true, quality: 50 })
        .toBuffer()

    }))

    await S3.putObject({
      Body: optmized,
      Bucket: process.env.bucket,
      ContentType: 'image/jpeg',
      Key: `Compressed/${basename(key, extname(key))}`
    }).promise()

    return {
      statusCode: 301,
      body: {}
    }
  } catch(err) {
    console.log(err);
  }
};
