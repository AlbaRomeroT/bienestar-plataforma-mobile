import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Profile } from "@app/interfaces/profile.interface";
import { FormValidators } from "@app/validators/form-validators";
import { ProfileService } from "../../../services/profile.service";
import { AuthService } from "../../../services/auth.service";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { MessageEnum } from "@app/enums/message-enum";
import { ToastService } from "../../../services/toast.service";

@Component({
  selector: "app-green-button",
  templateUrl: "./green-button.page.html",
  styleUrls: ["./green-button.page.scss"],
})
export class GreenButtonPage implements OnInit {
  greenButtonForm: FormGroup;
  isSubmitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.greenButtonForm = this.formBuilder.group({
      phone: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          FormValidators.PhoneNumberValidator,
        ])
      ),
    });
  }

  get phone() {
    return this.greenButtonForm.get("phone");
  }

  errorMessages = {
    phone: [
      {
        type: "validPhoneNumber",
        message: "Verifique que el número de celular ingresado sea correcto.",
      },
    ],
  };

  async ngOnInit() {
    var profile = await this.authService.profile();
    if (profile.phone) {
      this.phone.setValue(profile.phone);
    }
  }

  next(): void {
    //this.router.navigate(["onboarding/qrpass"]);
    this.router.navigate(["home"]);
  }

  async save() {
    this.isSubmitted = true;
    console.table("Green forms => ", this.greenButtonForm.value);

    // Se guarda la información y se redirige a propositos
    if (this.greenButtonForm.valid) {
      console.table("ISVALID => ", this.greenButtonForm.value);

      // Update the phone profile in db
      var profile: Profile = {};
      profile.phone = this.phone.value;
      profile.email = await this.authService.email();

      console.log("PROFILE => ", profile);

      this.profileService.update(profile).subscribe(
        async (response: AppHttpResponse<Profile>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              MessageEnum.ERROR_SAVE,
              null,
              null,
              "top",
              "danger"
            );
            return;
          }
          console.log("no hasErrors => ", response);
          // Update the profile phone in localstorage
          var savedProfile: Profile = await this.authService.profile();
          savedProfile.phone = profile.phone;
          await this.authService.saveProfile(savedProfile);

          // Navigate to next screen
          //this.router.navigate(["onboarding/qrpass"]);
          this.router.navigate(["home"]);
        },
        (error: TrackHttpError) => {
          this.toastService.showMessage(
            MessageEnum.ERROR_SAVE,
            null,
            null,
            "top",
            "danger"
          );
          console.log(error);
        }
      );
    }
  }
}
