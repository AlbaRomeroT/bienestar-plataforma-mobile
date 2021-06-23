import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationsService } from "../../services/notifications.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  reloading = false;
  public photo: string = "/assets/menu/profile-without-photo.svg";

  constructor(
    private router: Router,
    public notificationService: NotificationsService
  ) {}

  ngOnInit() {}

  async goToNotifications() {
    this.router.navigate(["/notifications"]);
  }
}
