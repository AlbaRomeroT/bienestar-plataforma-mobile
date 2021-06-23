import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ModalNotConnectionComponent } from '@app/components/modal-not-connection/modal-not-connection.component';
import { ModalController } from '@ionic/angular';
import { ChronometerComponent } from 'qrpass-widgets/lib/symptom-widget/chronometer/chronometer.component';
import { Observable } from 'rxjs';

@Injectable()
export class ChronometerGuardGuard implements CanDeactivate<ChronometerComponent> {
  constructor(private modalController: ModalController){}
  canDeactivate(
    component: ChronometerComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean> | boolean | UrlTree {


      if (!window.navigator.onLine) {
        this.checkInternetConnection();
        return;
      }

      console.log(currentRoute.root);
      
      return true;
  }

  async checkInternetConnection() {
      let resp : boolean;
        let profileModal = await this.modalController.create({
            component: ModalNotConnectionComponent,
            cssClass: 'activities-actions-modal-save',
            componentProps: {
                action: 'save',
                description: 'Pruebe nuevamente ahora o en un par de minutos'
            }
        });

        profileModal.onDidDismiss().then(
            res => {

                if (res?.data?.dismissed == 'tryAgain') {
                  if (!window.navigator.onLine) {
                    this.closeModals();
                    this.checkInternetConnection();
                    resp = false
                    return resp;
                  }else{
                    this.closeModals();
                    resp = true;
                    return resp;
                  }
                }
                
                if(res?.data?.dismissed == 'back'){
                  //Boton volver
                  this.closeModals();
                  resp = false
                  return resp;
                }
            }
        )
        await profileModal.present();
  }

  closeModals(){
    let ele = window.document.getElementsByClassName('activities-actions-modal-save');
    console.log(ele);
    
    Array.from(ele).forEach((el:any) => {
        el.parentNode.removeChild(el);
    });
  }
  
}
