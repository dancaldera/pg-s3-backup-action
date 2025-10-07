# PostgreSQL S3 Backup Action

A GitHub Action that automatically backs up your PostgreSQL database and uploads it to Amazon S3.

## Features

- Automated PostgreSQL database backups
- Compression (gzip) to reduce file size
- Automatic upload to S3
- Timestamped backup files
- Support for custom PostgreSQL versions

## Usage

```yaml
name: Database Backup
on:
  schedule:
    - cron: '0 2 * * *'  # Run daily at 2 AM UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Backup PostgreSQL to S3
        uses: yourusername/pg-s3-backup-action@v1
        with:
          db_user: ${{ secrets.DB_USER }}
          db_name: ${{ secrets.DB_NAME }}
          db_host: ${{ secrets.DB_HOST }}
          db_port: ${{ secrets.DB_PORT }}
          db_pass: ${{ secrets.DB_PASS }}
          aws_key_id: ${{ secrets.AWS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_bucket: ${{ secrets.AWS_BUCKET }}
          postgres_version: '14'  # Optional, defaults to 14
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `db_user` | PostgreSQL database user | Yes | - |
| `db_name` | PostgreSQL database name | Yes | - |
| `db_host` | PostgreSQL database host | Yes | - |
| `db_port` | PostgreSQL database port | Yes | - |
| `db_pass` | PostgreSQL database password | Yes | - |
| `aws_key_id` | AWS Access Key ID | Yes | - |
| `aws_secret_access_key` | AWS Secret Access Key | Yes | - |
| `aws_bucket` | S3 bucket name | Yes | - |
| `postgres_version` | PostgreSQL version to use for pg_dump | No | `14` |

## Backup File Format

Backup files are named with the following pattern:
```
pg-backup-YYYY.M.D.H.M.tar.gz
```

Example: `pg-backup-2025.10.6.2.30.tar.gz`

## Requirements

- GitHub Actions runner with Node.js 20+
- PostgreSQL database accessible from GitHub Actions
- AWS S3 bucket with appropriate permissions
- AWS credentials with S3 write access

## AWS Permissions

Your AWS credentials need the following S3 permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## Security Notes

- Always use GitHub Secrets for sensitive data (credentials, passwords)
- Never commit credentials to your repository
- Ensure your S3 bucket has appropriate access controls
- Consider encrypting your S3 bucket

## License

ISC

## Author

Daniel Caldera
