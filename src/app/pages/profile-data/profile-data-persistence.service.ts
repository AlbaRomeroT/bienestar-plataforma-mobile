import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ProfileDataPersistenceService {
  _profileForm = null;
  _personalForm = null;
  _profesionalForm = null;

  _profile = null;
  _personal = null;
  _profesional = null;

  constructor() {}

  set profileForm(profileForm: FormGroup) {
    this._profileForm = profileForm.getRawValue();
    this._profile = profileForm.value;
  }

  get profileForm() {
    if (this._profileForm) {
      return this._profileForm;
    }
  }

  get isFemale() {
    if (this._profileForm) {
      return this._profileForm.gender == "F";
    }
  }

  set profesionalForm(profesionalForm: FormGroup) {
    this._profesionalForm = profesionalForm.getRawValue();
    this._profesional = profesionalForm.value;
  }

  get profesionalForm() {
    if (this._profesionalForm) {
      return this._profesionalForm;
    }
  }

  set personalForm(personalForm: FormGroup) {
    this._personalForm = personalForm.getRawValue();
    this._personal = personalForm.value;
  }

  get personalForm() {
    if (this._personalForm) {
      return this._personalForm;
    }
  }

  clearForms() {
    this._profileForm = null;
    this._profesionalForm = null;
    this._personalForm = null;
    this._profile = null;
    this._personal = null;
    this._profesional = null;
  }
}
