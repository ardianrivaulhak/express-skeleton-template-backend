pipeline {
    agent any
    environment {
        DOCKER_ID       = 'rdldevmobile'
        DOCKER_REPO     = 'dengerind-auth-service-nodejs'
        DEPLOY_NAME     = 'auth-service'
        NAMESPACE       = 'dengerind-dev-v2'
        VERSION         = '2.0.0'
    }

    tools { nodejs 'node' }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'installing dependencies...'
                sh 'yarn --prod'
                echo 'Install dependencies done!'
            }
        }
        stage('Build image') {
            steps {
                script {
                    myapp = docker.build("${DOCKER_ID}/${DOCKER_REPO}:${env.BUILD_ID}")
                    // No Cache
                    // myapp = docker.build("${DOCKER_ID}/${DOCKER_REPO}:${env.BUILD_ID}", "--no-cache .")
                }
            }
        }
        stage('Push image') {
            // input {
            //     message "Ready to Push Image?"
            //     ok "Yes, Push to DockerHub"
            // }
            steps {
                script {
                    docker.withRegistry('', 'dockerhub') {
                        myapp.push("${VERSION}-${BUILD_ID}-dev")
                    }
                }
                echo 'Clean up build image...'
                sh 'docker rmi $DOCKER_ID/$DOCKER_REPO:$BUILD_ID'
                sh 'docker rmi $DOCKER_ID/$DOCKER_REPO:$VERSION-$BUILD_ID-dev'
                echo 'Clean up build done!'
                echo 'Push image to DockerHub done!'
            }
        }
        stage('Deploy to GKE') {
            steps {
                echo 'Deploy to GKE...'
                sshagent(credentials: ['private_key-backend_to_jumphost']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no root@10.23.25.5 "cd ~/infra-as-code/sources-dev/back-end-services/auth && \
                        sed -i 's/${DOCKER_REPO}:latest/${DOCKER_REPO}:${VERSION}-${BUILD_ID}-dev/g' 2_deployment.yaml && \
                        kubectl apply -f 2_deployment.yaml && \
                        git stash"
                    '''
                }
                echo 'Update Deployment Image done!'
            }
        }
    }
}
