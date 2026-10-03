pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        npx sonar-scanner \
                          -Dsonar.organization=rb35 \
                          -Dsonar.projectKey=RB35_GallaryCICD
                    '''
                }
            }
        }
    }
}
