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

        stage('Security') {
            steps {
                dir('api') {
                    bat 'snyk code test --org=ec34bc94-cbae-4c21-88a5-45255637b01e --report'
                }
            }
        }
    }
}
