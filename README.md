# Simple S3 Web Application to upload multiple files
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## About
This repository contains the Open Source Software to demonstrate how to build a simple WebApp to users upload files to S3.  

### Features
- User authentication with Amazon Cognito
- File upload to user-specific input folders
- File browsing for input and output folders
- User-specific access control (users can only access their own files)
- File download functionality

### Built With

- [AWS Amplify Framework](https://docs.amplify.aws/)
- [Amazon S3](https://aws.amazon.com/s3/)
- [Amazon Cognito](https://aws.amazon.com/cognito/)
- [AWS UI](https://github.com/aws/awsui-documentation)
- [Node.JS](https://nodejs.org/en/)
- [React](https://reactjs.org/)

## Getting Started

First install AWS Amplify CLI
`npm install -g @aws-amplify/cli`

Inside the project folder, initialize Amplify:
`amplify init`
> Project name example: s3-uploader-ui

Add the authentication component
`amplify add auth`

Add the storage component
`amplify add storage`

> Select: Content (Images, audio, video, etc.)
> 
> Provide a label for this category or use the suggested one from the wizard.
>
> Select the option create/update from the list of actions
>
> **Important**: When configuring auth rules, make sure to select "Auth users only" and enable read/write permissions

Add the application hosting
`amplify hosting add`

> Select Amazon CloudFront and S3. Define a new unique bucket name or use the suggested one.

Now, you can build the web app (front-end)

```bash
npm install
amplify push
amplify publish
```

The output of the `amplify publish` if all the deployment was done correctly is a URL
This URL is the web application URl where you can open from the browser to access your application.
By default, the front-end come with the sign-up UI disabled. To enable the sign-up UI you need to change the file: `App.css`

Comment or remove the following block:

```css
.amplify-tabs {
display: none;
}
```
> After this change you need to re-run `amplify publish`

## File Structure

The application organizes files in the following structure:

- Each user has their own directory in S3 (based on their username)
- Within each user directory, there are two subdirectories:
  - `input/`: Where uploaded files are stored
  - `output/`: Where result files are stored (can be populated by backend processes)
- Users can only access files within their own directory

## Usage

1. **Sign in** to the application using your credentials
2. **Upload files** using the Upload page - files will be stored in your personal input folder
3. **Browse files** using the Input Files and Output Files navigation links
4. **Download files** by selecting them in the file browser and clicking the Download button

### Prerequisites

To build this solution you must have:
- AWS account
- Permissions to create resources in the AWS account
- Node.js 16.x or higher

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
