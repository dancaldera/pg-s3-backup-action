const { execute } = require('@getvim/execute')
const compress = require('gzipme')
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const core = require('@actions/core')

const user = core.getInput('db_user', {
  required: true
})
const name = core.getInput('db_name', {
  required: true
})
const host = core.getInput('db_host', {
  required: true
})
const port = core.getInput('db_port', {
  required: true
})
const pass = core.getInput('db_pass', {
  required: true
})
const Bucket = core.getInput('aws_bucket', {
  required: true
})
const postgresVersion = core.getInput('postgres_version', {
  required: false
})

const s3 = new S3({
  accessKeyId: core.getInput('aws_key_id'),
  secretAccessKey: core.getInput('aws_secret_access_key')
})

var currentDate, backupFile, backupFileGz

const date = new Date()
currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`
backupFile = `pg-backup-${currentDate}.tar`
backupFileGz = `${backupFile}.gz`

execute(`/usr/lib/postgresql/${postgresVersion}/bin/pg_dump 'postgres://${user}:${pass}@${host}:${port}/${name}' -f ${backupFile}`)
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
