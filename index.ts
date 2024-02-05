// import { $ } from "bun";
// import fs from "fs";
// import S3 from "aws-sdk/clients/s3";
import core from "@actions/core";

const dbUrl = core.getInput("db_url", {
  required: true,
});
const Bucket = core.getInput("aws_bucket", {
  required: true,
});
const postgresVersion = core.getInput("postgres_version", {
  required: false,
});

console.log(dbUrl);
console.log(Bucket);
console.log(postgresVersion);

// const s3 = new S3({
//   accessKeyId: core.getInput("aws_key_id"),
//   secretAccessKey: core.getInput("aws_secret_access_key"),
// });

// var currentDate, backupFile, backupFileGz;

// const date = new Date();
// currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
// backupFile = `pg-backup-${currentDate}.tar`;
// backupFileGz = `${backupFile}.gz`;

// execute(
//   `/usr/lib/postgresql/${postgresVersion}/bin/pg_dump 'postgres://${user}:${pass}@${host}:${port}/${name}' -f ${backupFile}`,
// )
//   .then(async () => {
//     await compress(backupFile);
//     fs.unlinkSync(backupFile);
//     console.log(`Backup created successfully`);

//     const fileContent = fs.readFileSync(backupFileGz);

//     const params = {
//       Bucket,
//       Key: backupFileGz,
//       Body: fileContent,
//     };

//     s3.upload(params, function (err, data) {
//       if (err) {
//         console.log("Error", err);
//       }
//       if (data) {
//         fs.unlinkSync(backupFileGz);
//         console.log("Upload Success", data.Location);
//       }
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
