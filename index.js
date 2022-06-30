const { execute } = require('@getvim/execute')
const compress = require('gzipme')
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const core = require('@actions/core')

const user = core.getInput('DB_USER', {
  required: true
})
const name = core.getInput('DB_NAME', {
  required: true
})
const host = core.getInput('DB_HOST', {
  required: true
})
const port = core.getInput('DB_PORT', {
  required: true
})
const pass = core.getInput('DB_PASS', {
  required: true
})

const Bucket = core.getInput('BUCKET', {
  required: true
})

const s3 = new S3({
  accessKeyId: core.getInput('ACCESS_KEY_ID'),
  secretAccessKey: core.getInput('SECRET_ACCESS_KEY')
})

var currentDate, backupFile, backupFileGz

const date = new Date()
currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`
backupFile = `pg-backup-${currentDate}.tar`
backupFileGz = `${backupFile}.gz`

execute(`pg_dump 'postgres://${user}:${pass}@${host}:${port}/${name}' -f ${backupFile}`)
  .then(async () => {
    await compress(backupFile)
    fs.unlinkSync(backupFile)
    console.log(`Backup created successfully`)

    const fileContent = fs.readFileSync(backupFileGz)

    const params = {
      Bucket,
      Key: backupFileGz,
      Body: fileContent
    }

    s3.upload(params, function (err, data) {
      if (err) {
        console.log('Error', err)
      }
      if (data) {
        fs.unlinkSync(backupFileGz)
        console.log('Upload Success', data.Location)
      }
    })
  })
  .catch(err => {
    console.log(err)
  })
