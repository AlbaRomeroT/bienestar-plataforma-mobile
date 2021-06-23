pipeline {
    agent {
        node {
            label 'nodejenkinsjdk11'
        }
    }
    options {
        buildDiscarder logRotator(
                    daysToKeepStr: '16',
                    numToKeepStr: '10'
            )
    }
    stages {

    	stage(' Unit Testing') {

            when { anyOf { branch 'PR-*'; branch 'develop'; branch 'stage'; branch 'master' } }

                steps {
                    sh """
                    echo "Running Unit Tests"
                    """
                   /* withGradle {
                        sh ' ./gradlew build'
                        sh ' ./gradlew test'
                    }*/
                }
            }

    	stage('Code Analysis') {
            when { anyOf { branch 'PR-*'; branch 'develop'; branch 'stage'; branch 'master' } }

            steps {
                sh """
                echo "Running Code Analysis "
                """
                withSonarQubeEnv('SonarCloud') {
                    // sh ' ./gradlew sonarqube'
                }
           
            }
        }

    stage('Provision infrastructure Stage') { 
           when {
               branch 'stage' 
           }
           steps {    
               withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: '85a9d0e1-9091-4d3e-a90f-76ee0253b978', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    
                    echo "--------- Executing Terraform apply plan Stage... ------------"

                }
            }
        }

        stage('Provision infrastructure Develop') {
           when {
               branch 'develop' 
           }
           steps {    
               withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: '85a9d0e1-9091-4d3e-a90f-76ee0253b978', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    
                    echo "--------- Executing Terraform apply plan Dev... ------------ "
                    
                }
               
            }
        }

       stage('Provision infrastructure Master') {
           when {
               branch 'master' 
           }
           steps {    
               withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: '85a9d0e1-9091-4d3e-a90f-76ee0253b978', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    
                    echo "--------- Executing Terraform apply plan ... ------------"
                }
               
            }
        }
        
    }
    post { 
        always { 
            cleanWs()
        }
    }
}
