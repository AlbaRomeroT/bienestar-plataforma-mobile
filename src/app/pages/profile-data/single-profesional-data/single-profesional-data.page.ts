import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ProfileDataProfessional } from "@app/interfaces/profile-data/profile-data.interface";
import { ProfileDataPersistenceService } from "../profile-data-persistence.service";
import { AuthService } from "../../../services/auth.service";
import { ProfileDataService } from "../../../services/profile-data.service";
import { JOB_STATUSES } from "../../../../assets/profile-data/data/jobStatuses.const";
import { EPS } from "../../../../assets/profile-data/data/eps.const";
import { POSITIONS } from "../../../../assets/profile-data/data/positions.const";
import { JOB_AREAS } from "../../../../assets/profile-data/data/jobAreas.const";

@Component({
  selector: "app-single-profesional-data",
  templateUrl: "./single-profesional-data.page.html",
  styleUrls: ["./single-profesional-data.page.scss"],
})
export class SingleProfesionalDataPage implements OnInit {
  public title: string;
  public subtitle: string;
  public showSpinner: boolean = true;

  profesionalForm: FormGroup;
  @Output() public nextEvent: EventEmitter<any> = new EventEmitter();
  @Output() public previousEvent: EventEmitter<any> = new EventEmitter();

  steps = {
    perfil: "perfil",
    profesional: "profesional",
    personal: "personal",
  };

  public selectEpsOptions: any = {
    header: "¿Cuál es su EPS?",
    translucent: true,
  };

  public selectPositionOptions: any = {
    header: "¿Cuál es su cargo?",
    translucent: true,
  };

  public selectJobAreaOptions: any = {
    header: "¿Cuál es su área de trabajo?",
    translucent: true,
  };

  public selectJobStatusOptions: any = {
    header: "¿Seleccione su situación laboral?",
    translucent: true,
  };

  public jobStatuses: any = [];
  public positions: any = [];
  public jobAreas: any = [];
  public epss: any = [];

  public profileDataProfessional: ProfileDataProfessional;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private profileDataService: ProfileDataService,
    private profileDataPersistenceService: ProfileDataPersistenceService
  ) {
    this.title = "Información profesional";
    this.subtitle = "Cuéntenos sobre su trabajo";

    this.profesionalForm = this.formBuilder.group({
      jobStatus: new FormControl("", [Validators.required]),
      hasArl: new FormControl("", [Validators.required]),
      hasBolivarArl: new FormControl("", [Validators.required]),
      worksInHealthSector: new FormControl("", [Validators.required]),
      companyName: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      position: new FormControl("", [Validators.required]),
      jobArea: new FormControl("", [Validators.required]),
      eps: new FormControl("", [Validators.required]),
    });
  }

  get jobStatus() {
    return this.profesionalForm.get("jobStatus");
  }

  get hasArl() {
    return this.profesionalForm.get("hasArl");
  }

  get hasBolivarArl() {
    return this.profesionalForm.get("hasBolivarArl");
  }

  get worksInHealthSector() {
    return this.profesionalForm.get("worksInHealthSector");
  }

  get companyName() {
    return this.profesionalForm.get("companyName");
  }

  get position() {
    return this.profesionalForm.get("position");
  }

  get jobArea() {
    return this.profesionalForm.get("jobArea");
  }

  get eps() {
    return this.profesionalForm.get("eps");
  }

  get isEmployee() {
    return this.jobStatus.value == "empleado";
  }

  get isEmployeeOfHealthSector() {
    return this.worksInHealthSector.value == "true";
  }

  ngOnInit() {
    this.showSpinner = true;
    this.getLists();
    this.setInitialValues();
    this.onJobStatusChange();
    this.onWorksInHealthSectorChange();
    this.showSpinner = false;
  }

  ngOnDestroy(): void {
    console.log("Destruyendo profesional..");
  }

  checkInputFocus() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "none";
  }

  checkInputBlur() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }

  async getLists() {
    this.jobStatuses = JOB_STATUSES;
    this.epss = EPS;
    this.positions = POSITIONS;
    this.jobAreas = JOB_AREAS;
  }

  async setInitialValues() {
    if (this.profileDataPersistenceService.profesionalForm) {
      const values = this.profileDataPersistenceService.profesionalForm;

      setTimeout(() => {
        this.profesionalForm.patchValue(values);
      }, 400);

      return;
    }

    this.getValuesFromProfessionalService();
  }

  async getValuesFromProfessionalService() {
    var email = await this.authService.email();
    this.profileDataService.getProfessional(email).subscribe((values) => {
      this.profesionalForm.patchValue(values.body);
    });
  }

  onJobStatusChange(): void {
    var employeeFields = ["worksInHealthSector", "companyName"];

    if (this.isEmployee) {
      for (var field of employeeFields) {
        this.profesionalForm.controls[field].setValidators([
          Validators.required,
        ]);
        this.profesionalForm.controls[field].updateValueAndValidity();
      }
    } else {
      for (var item of employeeFields) {
        this.profesionalForm.controls[item].setValidators(null);
        this.profesionalForm.controls[item].updateValueAndValidity();
        this.profesionalForm.controls[item].setValue(null);
      }
    }
  }

  onWorksInHealthSectorChange(): void {
    var worksInHealthSectorFields = ["position", "jobArea"];

    if (this.isEmployeeOfHealthSector) {
      for (var field of worksInHealthSectorFields) {
        this.profesionalForm.controls[field].setValidators([
          Validators.required,
        ]);
        this.profesionalForm.controls[field].updateValueAndValidity();
      }
    } else {
      for (var item of worksInHealthSectorFields) {
        this.profesionalForm.controls[item].setValidators(null);
        this.profesionalForm.controls[item].updateValueAndValidity();
        this.profesionalForm.controls[item].setValue(null);
      }
    }
  }

  next(): void {
    console.log("NEXT");
    console.log("Profesional => ", JSON.stringify(this.profesionalForm.value));

    if (this.profesionalForm.valid) {
      this.profileDataPersistenceService.profesionalForm = this.profesionalForm;

      var tab = {
        detail: {
          value: this.steps.personal,
        },
      };
      this.nextEvent.emit(tab);
    }
  }

  previous(): void {
    console.log("PREVIOUS");

    this.profileDataPersistenceService.profesionalForm = this.profesionalForm;
    var tab = {
      detail: {
        value: this.steps.perfil,
      },
    };
    this.previousEvent.emit(tab);
  }
}
