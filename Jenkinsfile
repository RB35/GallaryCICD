pipeline {
    agent any

    environment {
        IMAGE = "gallery-api:${BUILD_NUMBER}"
        COMPOSE_PROJECT_NAME = "jenkins-${BUILD_NUMBER}"
    }

    stages {
        stage('Install') {
            steps {
                dir('api') {
                    bat 'pnpm ci'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('api') {
                    bat "docker build -t ${IMAGE} ."
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('api') {
                    withSonarQubeEnv('SonarQube Cloud') {
                        bat '''
                            npx sonar-scanner \
                            -Dsonar.organization=rb35 \
                            -Dsonar.projectKey=RB35_GallaryCICD \
                            -Dsonar.coverage.exclusions=**/*
                        '''
                    }
                }
            }
        }

        stage("Quality gate") {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }

        stage('Security') {
            steps {

                dir('api') {
                    echo 'Checking pnpm audit for known vulnerabilities...'
                    bat 'pnpm audit --audit-level=moderate'

                    echo 'Running snyk code security scanner...'
                    snykSecurity(
                    snykInstallation: 'snyk@latest',
                    snykTokenId: 'snyk-api-token',
                    additionalArguments: '--all-projects'
                    )
                }
            }
        }
    }
}
