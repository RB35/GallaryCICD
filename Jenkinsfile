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

        stage('Start Intergration Test Environment') {
            steps {
                dir("testing"){
                powershell '''
                    docker compose -p $env:COMPOSE_PROJECT_NAME `
                        -f docker-compose.test.yml `
                        up -d

                    if ($LASTEXITCODE -ne 0) {
                        throw "Failed to start Docker Compose"
                    }

                    Write-Host "Waiting for API..."

                    for ($i = 1; $i -le 30; $i++) {
                        try {
                            $response = Invoke-WebRequest `
                                -Uri "http://localhost:3000/api/health" `
                                -UseBasicParsing `
                                -TimeoutSec 2

                            if ($response.StatusCode -eq 200) {
                                Write-Host "API is ready!"
                                exit 0
                            }
                        }
                        catch {
                            Write-Host "API not ready yet..."
                        }

                        Start-Sleep -Seconds 2
                    }

                    throw "API failed to start"
                '''
                }
            }
        }
    }
}
