import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ProfileServiceUser } from "../../../../services/user/profile/profile.service";
import { EPS } from "@assets/profile-data/data/eps.const";
import { ProfessionalInfo } from "../../../../interfaces/user/profile/user.interface";
import { POSITIONS } from "@assets/profile-data/data/positions.const";
import { Subject } from "rxjs";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { JOB_STATUSES } from "@assets/profile-data/data/jobStatuses.const";
import { AuthService } from "@app/services/auth.service";
import { ProfileDataService } from "@app/services/profile-data.service";
import { ProfileDataPersistenceService } from "@app/pages/profile-data/profile-data-persistence.service";
import { ModalActivitiesComponent } from "@app/components/modal-activities/modal-activities.component";
import { JOB_AREAS } from "@assets/profile-data/data/jobAreas.const";
import { ModalService } from "@app/services/modal.service";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";

@Component({
  selector: "app-professional",
  templateUrl: "./professional.component.html",
  styleUrls: ["./professional.component.scss"],
})
export class ProfessionalComponent implements OnInit, OnDestroy {
  @Input()
  public parentEvent: Subject<any>;

  @Output() saveProfessionalInfo = new EventEmitter<ProfessionalInfo>();

  public professionalInfo: ProfessionalInfo;

  userForm: FormGroup;

  public jobStatuses: any = [];
  public positions: any = [];
  public jobAreas: any = [];
  public epss: any = [];
  public saved: boolean;
  public modalIsActive: boolean = false;

  constructor(
    public profileService: ProfileServiceUser,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private profileDataService: ProfileDataService,
    private profileDataPersistenceService: ProfileDataPersistenceService,
    private modalService: ModalService,
    private modalCtrl: ModalController
  ) {
    this.userForm = this.formBuilder.group({
      jobArea: new FormControl("", [Validators.required]),

      jobStatus: new FormControl("", [Validators.required]),
      hasArl: new FormControl("", [Validators.required]),
      worksInHealthSector: new FormControl("", [Validators.required]),

      hasBolivarArl: new FormControl("", [Validators.required]),
      position: new FormControl("", [Validators.required]),

      eps: new FormControl("", [Validators.required]),
      companyName: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  get jobStatus() {
    return this.userForm.get("jobStatus");
  }

  get hasArl() {
    return this.userForm.get("hasArl");
  }

  get hasBolivarArl() {
    return this.userForm.get("hasBolivarArl");
  }

  get worksInHealthSector() {
    return this.userForm.get("worksInHealthSector");
  }

  get companyName() {
    return this.userForm.get("companyName");
  }

  get position() {
    return this.userForm.get("position");
  }

  get jobArea() {
    return this.userForm.get("jobArea");
  }

  get eps() {
    return this.userForm.get("eps");
  }

  get isEmployee() {
    return this.jobStatus.value == "empleado";
  }

  get isEmployeeOfHealthSectorFull() {
    return this.worksInHealthSector.value == "true";
  }

  ngOnDestroy(): void {
    this.saved = true;
  }

  ngOnInit() {
    this.parentEvent?.subscribe((event) => {
      this.ngOnDestroy();
    });
    this.saved = false;
    this.getListsFull();
    this.setInitialValuesFull();
    this.onJobStatusChangeFull();
    this.onWorksInHealthSectorChangeFull();
  }

  async getListsFull() {
    this.jobStatuses = JOB_STATUSES;
    this.epss = EPS;
    this.positions = POSITIONS;
    this.jobAreas = JOB_AREAS;
  }

  async setInitialValuesFull() {
    if (this.profileDataPersistenceService.profesionalForm) {
      const values = this.profileDataPersistenceService.profesionalForm;

      setTimeout(() => {
        this.userForm.patchValue(values);
      }, 400);

      return;
    }

    this.getValuesFromProfessionalServiceFull();
  }

  async getValuesFromProfessionalServiceFull() {
    var email = await this.authService.email();
    this.profileDataService.getProfessional(email).subscribe((values) => {
      this.userForm.patchValue(values.body);
    });
  }

  checkInputFocus() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "none";
  }

  checkInputBlur() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }

  onJobStatusChangeFull(): void {
    var employeeFields = ["worksInHealthSector", "companyName"];

    if (this.isEmployee) {
      for (var field of employeeFields) {
        this.userForm.controls[field].setValidators([Validators.required]);
        this.userForm.controls[field].updateValueAndValidity();
      }
    } else {
      for (var item of employeeFields) {
        this.userForm.controls[item].setValidators(null);
        this.userForm.controls[item].updateValueAndValidity();
        this.userForm.controls[item].setValue(null);
      }
    }
  }

  onWorksInHealthSectorChangeFull(): void {
    var worksInHealthSectorFields = ["position", "jobArea"];

    if (this.isEmployeeOfHealthSectorFull) {
      for (var field of worksInHealthSectorFields) {
        this.userForm.controls[field].setValidators([Validators.required]);
        this.userForm.controls[field].updateValueAndValidity();
      }
    } else {
      for (var item of worksInHealthSectorFields) {
        this.userForm.controls[item].setValidators(null);
        this.userForm.controls[item].updateValueAndValidity();
        this.userForm.controls[item].setValue(null);
      }
    }
  }

  async onSubmitTemplateFull() {
    if (this.userForm.valid) {
      this.modalIsActive = true;
      this.profileDataPersistenceService.profesionalForm = this.userForm;
      var email = await this.authService.email();
      var professional = Object.assign(
        {},
        this.profileDataPersistenceService._profesional
      );

      professional.email = email;
      this.profileDataService.saveProfile(professional).subscribe(
        (response) => {
          this.modalIsActive = false;
          this.showConfirmAddMessageSaved();
          this.saved = true;
          console.log("response save profile professional", response);
        },
        (error: TrackHttpError) => {
          console.log("error save profile professional", error);
          this.modalIsActive = false;
        }
      );
    } else {
      console.log("no valid Form!!");
    }
  }

  async showConfirmAddMessageSaved() {
    await this.modalService.showConfirmAddMessage("profile");
  }

  async showChangeScreen() {
    let profileModal = await this.modalCtrl.create({
      component: ModalActivitiesComponent,
      cssClass: "activities-actions-modal-delete",
      componentProps: {
        action: "del",
        title: "¿Está seguro de continuar?",
        description: "Si sale de esta pantalla perderá los datos no guardados",
      },
    });
    profileModal.onDidDismiss().then(async (res) => {});
    return await profileModal.present();
  }
}
