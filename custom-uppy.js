// custom-uppy.js
window.Uppy = {}
Uppy.Core = require('@uppy/core')
const { Plugin } = require('@uppy/core')
Uppy.Plugin = Plugin
Uppy.XHRUpload = require('@uppy/xhr-upload')
Uppy.AwsS3 = require('@uppy/aws-s3')
Uppy.AwsS3Multipart = require('@uppy/aws-s3-multipart')
Uppy.GoldenRetriever = require('@uppy/golden-retriever')
