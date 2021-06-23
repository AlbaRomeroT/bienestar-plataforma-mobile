import { FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import * as moment from 'moment';


export class FormValidators {
  static PhoneNumberValidator(control: FormControl) {

    let regExp = /^[3][0-3][0-9]{8}$/;

    if (!regExp.test(control.value)) {
      return { "validPhoneNumber": true };
    }
    return null;
  }

  static AdultValidator(control: FormControl) {

    if (!control.value) {
      return null;
    }

    var birthDay = moment(control.value).toDate();
    var age = moment().diff(birthDay, 'years');

    if (age < 18) {
      return { "validAdult": true };
    }

    return null;
  }

  static AtLeastOneMinuteValidator(control: FormControl) {
    if(!control.value){
      return { "validAtLeastOneMinute": true };
    }
    var date = moment(control.value);

    var minute = date.minute(); 
    var hour = date.hour();

    if(minute < 1 && hour < 1){
      return { "validAtLeastOneMinute": true };
    }

    return null;
  }

  static DocumentValidator(formControl: FormControl) {
    let regExp = /^([0-9]){5,10}$/;

    if (!regExp.test(formControl.value)) {
      return { "validDocument": true };
    }
    return null;
  }

  static NameValidator(formControl: FormControl) {
    let regExp = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{0,20}$/;

    if (!regExp.test(formControl.value)) {
      return { "validName": true };
    }
    return null;
  }

  static PhoneNumberValidatorEmpty(control: FormControl) {

    if (control.value === '' || control.value === null) {
      return null;
    }

    let regExp = /^[3][0-3][0-9]{8}$/;

    if (!regExp.test(control.value)) {
      return { "validPhoneNumber": true };
    }
    return null;
  }

  static atLeastOneCheckboxCheckedValidator(
    minRequired = 1
  ): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0
  
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key]
  
        if (control.value) {
          checked++
        }
      })
  
      if (checked < minRequired) {
        return {
          requireCheckboxToBeChecked: true,
        }
      }
  
      return null
    }
  }

  static Integers(control: FormControl) {

    if (!control.value) {
      return null;
    }

    let regExp = /^[0-9]*$/;

    if (!regExp.test(control.value)) {
      return { "validIntegers": true };
    }

    return null;
  }

  static Decimals(control: FormControl) {

    if (!control.value) {
      return null;
    }

    let regExp = /^\d{1,10}(\.\d{1,2})?$/;

    if (!regExp.test(control.value)) {
      return { "validDecimals": true };
    }
    
    return null;
  }

}
