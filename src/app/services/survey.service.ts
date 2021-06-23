import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AppHttpResponse, TrackHttpError } from '@app/interfaces/app-http-response.interface';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ResponseDTO } from '../interfaces/response.interface';
import { Survey } from '@app/interfaces/survey';
import { ModalController,Platform } from '@ionic/angular';
import { SurveyModalComponent } from '@app/components/survey-modal/survey-modal.component';

const TOKEN_KEY = "token-node";
@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private survey : Survey;
  
  bienestarUrlApi:string = environment.bienestarUrlApi;
  url:string;
 
  constructor(private http: HttpClient,
    private modalCtrl: ModalController,
    private plt: Platform,) { } 

  getSurveyResponse(email: string): Observable<AppHttpResponse<any> | TrackHttpError>{

    const url = `${environment.bienestarUrlApi}/profile/survey/info/${email}`;
   
    return this.http.get<AppHttpResponse<any>>(url).pipe(
      map((response: ResponseDTO) => {
        console.log('Response...',response);        
        return response.body;
      }),
      catchError((error) => {
        console.log(error);
        return of([]);
      })
    );
  }

 

  saveSurveyResponse(survey: Survey): Observable<AppHttpResponse<any> | TrackHttpError> {
   
   const url = `${environment.bienestarUrlApi}/profile/survey/info`;
   
    return this.http.post<AppHttpResponse<any>>(url,survey).pipe(
      map((response: ResponseDTO) => {
        console.log('Respuesta..........',response);
        return response.body;
      }),
      catchError((error) => {
        console.log('Error..........',error);
        return of([]);
      })
    );
  }
  
  saveSurvey(profile: any): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/profile/survey/info`;
    return this.http
      .post<null>(url, profile)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  private handleHttpError(
    error: HttpErrorResponse
  ): Observable<TrackHttpError> {
    console.log("ERROR => ", error);
    let dataError = new TrackHttpError();
    dataError.friendlyMessage = "Un error a ocurrido obteniendo los datos.";
    return throwError(dataError);
  }

   validateShowSurvey(email:string){
    let url = `${environment.surveyUrl}?email=${email}`
    const token = localStorage.getItem(TOKEN_KEY);
    this.getSurveyResponse(email)
      .subscribe((respuesta: any) => {
        this.survey=<Survey>respuesta;        
        if(this.survey==null){                  
          this.recordSurvey(email);
        }
        else{
            if(this.survey.showSurvey){   
            if (this.plt.is("ios")) {              
                url=`${url}&os=IOS&a=${token}`;
            }else{                
                url=`${url}&os=ANDROID&a=${token}`;        
            }          
          this.openModal(SurveyModalComponent,url);
        }
      }
      }, error => {
        console.log(error);
      })
  }
  

  async openModal(modalPage: typeof SurveyModalComponent,url_str:string) {
    
    const modal = await this.modalCtrl.create({
      component: modalPage,
      componentProps:{
        url:url_str
      },
      cssClass: 'survey-modal'
    });
    await modal.present();
  }
  
  private recordSurvey(email:string){
    let surveyT:Survey; 
          surveyT={email:email,surveyId:'',lastSurveyDate:'',showSurvey:false,totallyAnswered:false};              
          this.saveSurveyResponse(surveyT)
          .subscribe((respuestaSave: any)=>{   
            console.log('Respuesta',respuestaSave);                     
          },error=>{
            console.log('Error',error);            
          }
          )
  }
}
