pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                dir('api') {
                    bat 'pnpm ci'
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
                    bat 'pnpm audit --audit-level=moderate'c

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
