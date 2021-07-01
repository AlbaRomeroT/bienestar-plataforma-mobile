pipeline {
    agent any
    tools {
        nodejs 'node' 
    }
    stages {
    
        stage('Preparation') { // for display purposes
            steps {
                git branch: 'master', url: 'https://github.com/AlbaRomeroT/bienestar-plataforma-mobile.git'
            }
     
        }
        stage('Build') {
             steps {
                 sh 'npm --version'
                 sh 'rm -rf node_modules'
                 sh 'npm install'
                 sh 'npm run build'
                 sh 'sudo su'
                 sh 'ionic cap sync android'
                 sh 'cd android/capacitor-cordova-android-plugins/src/main/java/de/appplant/cordova/emailcomposer'
                 script{
                    def text = readFile file: "Provider.java"
                        text = text.replaceAll("import android.support.v4.content.FileProvider;" , "import androidx.core.content.FileProvider;")
                        writeFile file: "Provider.java", text: text 
                 }
                 sh 'sudo ionic capacitor copy android && cd android && sudo ./gradlew assembleDebug && cd ..'
                 echo BRANCH_NAME
            }
            
        }
    }
}
