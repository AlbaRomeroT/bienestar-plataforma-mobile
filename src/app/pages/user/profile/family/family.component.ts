import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FamiliyInfo } from "../../../../interfaces/user/profile/user.interface";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { FormValidators } from "@app/validators/form-validators";
import { Subject } from "rxjs";
import { AuthService } from "@app/services/auth.service";
import { ProfileDataService } from "@app/services/profile-data.service";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { LIVE_WITH } from "@assets/profile-data/data/liveWith.const";
import { ProfileDataPersistenceService } from "@app/pages/profile-data/profile-data-persistence.service";
import { ModalService } from "@app/services/modal.service";
@Component({
  selector: "app-family",
  templateUrl: "./family.component.html",
  styleUrls: ["./family.component.scss"],
})
export class FamilyComponent implements OnInit, OnDestroy, AfterViewInit {
  public familyInfo: FamiliyInfo;
  //familyInfoToSave:FamiliyInfo = {};

  @Input()
  public parentEvent: Subject<any>;

  public userForm: FormGroup;

  liveWithList: any[] = [];

  public listOfDiseases: any = [
    { name: "Diabetes" },
    { name: "Hipertensión arterial" },
    { name: "Desórdenes autoinmunes" },
    { name: "Enfermedades cardiovasculares" },
    { name: "Enfermedades pulmonares crónicas" },
    { name: "Enfermedades renales o hepáticas crónicas" },
    { name: "Obesidad" },
    { name: "Uso de esteroides o inmunosupresores" },
    { name: "Otro" },
  ];
  public modalIsActive: boolean = false;

  constructor(
    private profileDataService: ProfileDataService,
    private profileDataPersistenceService: ProfileDataPersistenceService,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService
  ) {}
  private createLiveWithCheckBoxes() {
    this.liveWithList.forEach(() =>
      this.liveWithControls.push(new FormControl(undefined, []))
    );
  }
  get liveWithControls() {
    return this.userForm.controls.liveWith as FormArray;
  }
  get familyDiseases() {
    return this.userForm.get("familyDiseases");
  }
  get contactName() {
    return this.userForm.get("contactName");
  }
  get contactPhone() {
    return this.userForm.get("contactPhone");
  }
  get liveWith() {
    return this.userForm.controls.liveWith as FormArray;
  }
  get dependents() {
    return this.userForm.get("dependents");
  }
  async getLists() {
    this.liveWithList = LIVE_WITH;
  }
  checkInputFocus() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "none";
  }
  checkInputBlur() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }
  ngOnDestroy(): void {
    console.log("Destruyendo family..");
  }
  ngOnInit() {
    this.parentEvent?.subscribe((event) => {
      this.ngOnDestroy();
    });
    this.buildForm();

    setTimeout(async () => {
      this.getUserFamilyInfo();
    }, 300);
  }
  ngAfterViewInit() {}
  /**
   * Obtiene la informaci\u00f3n familiar del usuario actual.
   */
  async getUserFamilyInfo() {
    var email = await this.authService.email();
    this.profileDataService.getFamily(email).subscribe(
      (values) => {
        this.familyDiseases.setValue(values.body.familyDiseases);
        this.contactName.setValue(values.body.contactName);
        this.contactPhone.setValue(values.body.contactPhone);
        if (values.body.liveWith) {
          for (var lw of values.body.liveWith) {
            var indexOf = this.liveWithList.findIndex((x) => x.id == lw.id);
            var liveWithControl = this.liveWithControls.controls[
              indexOf
            ] as FormControl;
            liveWithControl.setValue(true);
          }
        }
      },
      (error: TrackHttpError) => {
        console.log(error);
      }
    );
  }
  /**
   * Control de eventos de los radio-buttons
   **/
  setDisease(event): void {
    //console.log(event)
    this.familyInfo.disease = event.detail.value;
    this.userForm.get("familyDiseases").setValue(this.familyInfo.disease);
  }
  setDependents(event): void {
    //console.log(event)
    this.familyInfo.dependents = event.detail.value;
    this.userForm.get("dependents").setValue(this.familyInfo.dependents);
  }
  setFormValues(): void {
    this.familyDiseases.setValue(this.familyInfo.disease);
    this.dependents.setValue(this.familyInfo.dependents);
    this.userForm.get("contactName").setValue(this.familyInfo.contactName);
    this.userForm.get("contactPhone").setValue(this.familyInfo.contactPhone);
  }
  buildForm(): void {
    this.userForm = this.formBuilder.group({
      familyDiseases: new FormControl(""),
      contactName: [null],
      contactPhone: [null, [FormValidators.PhoneNumberValidatorEmpty]],
      liveWith: new FormArray(
        [],
        [FormValidators.atLeastOneCheckboxCheckedValidator(1)]
      ),
    });
    this.getLists();
    setTimeout(() => {
      this.createLiveWithCheckBoxes();
    }, 100);
  }
  /**
   * Acci\u00f3n del bot\u00f3n de guardado..
   */
  async onSubmitTemplate() {
    if (this.userForm.valid) {
      this.modalIsActive = true;
      this.profileDataPersistenceService.personalForm = this.userForm;
      const liveWith = this.userForm.value.liveWith
        .map((checked, i) =>
          checked
            ? { id: this.liveWithList[i].id, name: this.liveWithList[i].label }
            : null
        )
        .filter((v) => v !== null);
      var personal = Object.assign(
        {},
        this.profileDataPersistenceService._personal
      );
      console.log("personal", personal);

      personal.liveWith = liveWith;
      var email = await this.authService.email();
      personal.email = email;
      this.profileDataService.saveProfile(personal).subscribe(
        (response) => {
          console.log("response save profile family", response);
          this.modalIsActive = false;
          this.showConfirmAddMessageSaved();
        },
        (error: TrackHttpError) => {
          console.log("error save profile family", error);
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
}
