pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/makireddybhavya16/campustrace.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t campustracer .'
            }
        }

        stage('Stop Old Container') {
            steps {
                bat 'docker stop campustracer || exit 0'
                bat 'docker rm campustracer || exit 0'
            }
        }

        stage('Run Container') {
            steps {
bat 'docker run -d -p 3005:3002 --name campustracer campustracer'            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'cd backend && npm install'
                bat 'cd backend && npm install selenium-webdriver chromedriver'
            }
        }

        stage('Test') {
            steps {
                bat 'cd backend && node test.js'
            }
        }
    }
}