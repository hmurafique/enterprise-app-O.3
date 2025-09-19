pipeline {
  agent any

  environment {
    DOCKERHUB = "docker.io/your-dockerhub"
    FRONT_TAG = "${DOCKERHUB}/enterprise-frontend:${env.BUILD_NUMBER}"
    BACK_TAG  = "${DOCKERHUB}/enterprise-backend:${env.BUILD_NUMBER}"
    APP_DIR = "/home/ubuntu/enterprise-deployment" // on app server
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Images') {
      steps {
        sh 'docker build -t $FRONT_TAG ./frontend'
        sh 'docker build -t $BACK_TAG ./backend'
      }
    }

    stage('Run Unit Tests') {
      steps {
        // Insert test commands if present. For now a smoke test:
        sh 'echo "no unit tests configured - skipping"'
      }
    }

    stage('Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh 'docker push $FRONT_TAG'
          sh 'docker push $BACK_TAG'
        }
      }
    }

    stage('Deploy to App Server') {
      steps {
        sshagent(['app-server-ssh']) {
          // on app server we will have a docker-compose that pulls & restarts
          sh """
            ssh -o StrictHostKeyChecking=no ubuntu@${env.APP_SERVER_IP} '
              mkdir -p ${APP_DIR}
              cd ${APP_DIR}
              # fetch latest compose & env (we assume repo already cloned)
              git -C ${APP_DIR} pull || git clone https://github.com/your-org/enterprise-deployment.git ${APP_DIR}
              docker-compose pull
              docker-compose up -d --remove-orphans
            '
          """
        }
      }
    }
  }

  post {
    success { echo "Pipeline succeeded: ${env.BUILD_NUMBER}" }
    failure { echo "Pipeline failed"; }
  }
}
