# 🏋️‍♂️ Serverless Fitness Logger

A modern, serverless fitness tracking web application built with AWS services. Track your workouts, view progress charts, and manage your fitness journey - all running on AWS free tier!

## 🚀 Features

- **Workout Logging**: Log exercises with sets, reps, and weights
- **Progress Tracking**: Visual charts showing weight progression and workout volume
- **Workout History**: View and filter past workouts
- **Responsive Design**: Works on desktop and mobile devices
- **Serverless Architecture**: No servers to manage, scales automatically

## 🏗️ Architecture

- **Frontend**: HTML, CSS, JavaScript hosted on Amazon S3
- **Backend**: AWS Lambda functions (Python 3.12)
- **Database**: Amazon DynamoDB
- **API**: Amazon API Gateway
- **Monitoring**: Amazon CloudWatch

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Chart.js
- **Backend**: Python 3.12, AWS Lambda
- **Database**: Amazon DynamoDB
- **Infrastructure**: AWS (Amplify,S3, API Gateway, Lambda, DynamoDB, IAM, CloudWatch)

## 📱 Screenshots

![Home Page](screenshots/home-page1.png)
![History Page](screenshots/history-page.png)
![Progress Page](screenshots/progress-page.png)

## 🚀 Deployment

See [deployment-guide.md](docs/deployment-guide.md) for detailed setup instructions.

## 📊 Architecture Diagram

![Architecture](docs/architecture-diagram.jpg)

## 🖥️ AWS Console Screenshots

### DynamoDB Configuration
![DynamoDB Table](screenshots/aws-console/dynamodb-table.png)
![DynamoDB Data](screenshots/aws-console/dynamodb-items.png)

### Lambda Functions
![Lambda Functions](screenshots/aws-console/lambda-functions-list.png)
![Lambda Code](screenshots/aws-console/lambda-function-code.png)

### API Gateway Setup
![API Gateway](screenshots/aws-console/api-gateway-overview.png)
![API Methods](screenshots/aws-console/api-gateway-methods.png)

### S3 Hosting
![S3 Bucket](screenshots/aws-console/s3-bucket-overview.png)
![Website Hosting](screenshots/aws-console/amplify-website-hosting.png)

### Monitoring
![CloudWatch Logs](screenshots/aws-console/cloudwatch-logs.png)

## 💰 Cost

This application runs entirely within AWS free tier limits:
- Lambda: 1M requests/month
- DynamoDB: 25GB storage
- API Gateway: 1M requests/month
- S3: 5GB storage

## 🔗 Live Demo

[Live Application](https://master.d3gai7idzwfm3.amplifyapp.com/)

## 👨‍💻 Author

**Yash kale**
- GitHub: [@yashkale402](https://github.com/yashkale402)
- LinkedIn: [Yash Kale](https://www.linkedin.com/in/yashkale001/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
