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
                dir('testing') {
                    bat '''
                    docker-compose -p "%COMPOSE_PROJECT_NAME%" -f docker-compose.test.yml up -d
                    '''

                    powershell '''
                    Write-Host "Waiting for API container to become ready..."

                    $maxAttempts = 30
                    $attempt = 1

                    while ($attempt -le $maxAttempts) {
                        try {
                            Write-Host "Health check attempt $attempt/$maxAttempts"

                            # Bypass Jenkins proxy settings for localhost
                            $response = Invoke-WebRequest `
                                -Uri "http://localhost:8000/api/health" `
                                -UseBasicParsing `
                                -Proxy $null `
                                -TimeoutSec 2

                            if ($response.StatusCode -eq 200) {
                                Write-Host "API is ready!"
                                exit 0
                            }
                        }
                        catch {
                            Write-Host "API not ready... Details: $($_.Exception.Message)"
                        }

                        Start-Sleep -Seconds 2
                        $attempt++
                    }

                    Write-Error "API failed to become ready within 60 seconds."

                    Write-Host "Docker containers:"
                    docker-compose `
                        -p $env:COMPOSE_PROJECT_NAME `
                        -f docker-compose.test.yml `
                        ps

                    Write-Host "API logs:"
                    docker-compose `
                        -p $env:COMPOSE_PROJECT_NAME `
                        -f docker-compose.test.yml `
                        logs api

                    Write-Host "Postgres logs:"
                    docker-compose `
                        -p $env:COMPOSE_PROJECT_NAME `
                        -f docker-compose.test.yml `
                        logs postgres

                    exit 1
                '''
                }
            }
        }
    }
}
