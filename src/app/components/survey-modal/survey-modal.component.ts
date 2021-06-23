import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-survey-modal',
  templateUrl: './survey-modal.component.html',
  styleUrls: ['./survey-modal.component.scss'],
})
export class SurveyModalComponent implements OnInit {

  @Input() url:string;
  vidUrl:SafeResourceUrl;
  constructor(private modalCtrl:ModalController, private  domSanitizer:DomSanitizer) { }

  ngOnInit() {
    this.vidUrl=
    this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);    
  }
  exit(){
    this.modalCtrl.dismiss();
  }
}
