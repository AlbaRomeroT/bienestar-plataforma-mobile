import { Component, OnInit } from '@angular/core';
import { Sleepinfo } from '../../interfaces/sleep.interfase';
import { ModalService } from '../../services/modal.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SleepActivityService } from '@app/services/sleep-activity.service';

import * as moment from 'moment';
import { TrackHttpError } from '../../interfaces/app-http-response.interface';
import { FormValidators } from '@app/validators/form-validators';

@Component({
  selector: 'app-sleep',
  templateUrl: './sleep.page.html',
  styleUrls: ['./sleep.page.scss'],
})
export class SleepPage implements OnInit {

  public title: string = "Datos de sueño";
  public sleepForm: FormGroup;
  public sleepinfo: Sleepinfo;
  public modalIsActive: boolean = true;
  public time: Date = new Date();


  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private sleepService: SleepActivityService) {

    this.sleepinfo = {};
    this.inicializeForm();
  }

  ngOnInit() {

  }

  async ionViewDidEnter() {
    this.sleepForm?.reset();
    this.inicializeForm();
  }

  inicializeForm() {
    this.sleepForm = this.formBuilder.group({
      awoken: [null, [Validators.required, FormValidators.Integers]],
      time: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      asleep: ['00:00', [Validators.required, Validators.min(1)]],
      bed: [0]
    });
  }

  guardar() {
    if (this.sleepForm.valid) {
      this.modalIsActive = true;
      let valoresth = this.sleepForm.value;
      let timeIni = new Date(valoresth.time);
      let timeFin = new Date(valoresth.endTime);

      this.sleepinfo.awoken = valoresth.awoken;// entero
      this.sleepinfo.time = moment(timeIni).format("YYYY-MM-DDTHH:mm:ss[Z]");//"2021-04-06T15:01:59Z"
      this.sleepinfo.endTime = moment(timeFin).format("YYYY-MM-DDTHH:mm:ss[Z]");//"2021-04-06T15:01:59Z"
      this.sleepinfo.asleep = this.toSeconds(valoresth.asleep);//segundos
      this.sleepinfo.bed = this.toSeconds(valoresth.bed);//segundos
      console.log(this.sleepinfo);
      this.sleepService.saveActivity(this.sleepinfo).subscribe(
        (response) => {
          //console.log("response save sleepInfo", response);
          this.modalIsActive = false;
          this.showConfirmAddMessageSaved();
          this.sleepForm.reset();
        },
        (error: TrackHttpError) => {
          console.log("error save sleepInfo", error);
          this.modalIsActive = false;
        }
      );
    } else {
      console.log("no valid Form!!");
    }
  }

  toSeconds(hora: any): any {
    if(hora == "" || hora == null){
      return 0;
    }
    try {
      var a = hora.split(':');
      return ((a[0] * 60) * 60) + (a[1] * 60);
    } catch (error) {
      return 0;
    }
  }

  checkInputFocus() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "none";
  }
  checkInputBlur() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }

  async showConfirmAddMessageSaved() {
    await this.modalService.showConfirmAddMessage("sleep");
  }

  calculoTiempoenCama() {
    let valoresth = this.sleepForm.value;
    if (valoresth.time && valoresth.endTime) {
      let timeIni = moment(valoresth.time);
      let timeFin = moment(valoresth.endTime);
      var enCama = moment.utc(moment.duration(timeFin.diff(timeIni)).asMilliseconds()).format('HH:mm');
      this.sleepForm.patchValue({ bed: enCama });
    }
  }

  validarForm() {
    this.calculoTiempoenCama();
    if (this.sleepForm.valid) {
      this.modalIsActive = false;
      console.log("valid Form!!");
    } else {
      this.modalIsActive = true;
      console.log("no valid Form!!");
    }
  }

  get awoken(): FormControl {
    return this.sleepForm.get("awoken") as FormControl;
  }

  get awokenError(): boolean {
    if (this.awoken.hasError('validIntegers') && this.awoken.dirty && this.awoken.value) {
      return true;
    }
    return false;
  }
  get iniIime(): FormControl {
    return this.sleepForm.get("time") as FormControl;
  }

  get endTime(): FormControl {
    return this.sleepForm.get("endTime") as FormControl;
  }

  get asLeep(): FormControl {
    return this.sleepForm.get("asleep") as FormControl;
  }
  initTime() {
    if (!this.iniIime.value) {
      this.iniIime.setValue(0);
      this.iniIime.reset();
    }
  }

  initEndTime() {
    if (!this.endTime.value) {
      this.endTime.setValue(0);
      this.endTime.reset();
    }
  }
}