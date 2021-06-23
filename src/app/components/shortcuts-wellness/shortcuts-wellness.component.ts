import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-shortcuts-wellness',
  templateUrl: './shortcuts-wellness.component.html',
  styleUrls: ['./shortcuts-wellness.component.scss'],
})
export class ShortcutsWellnessComponent implements OnInit {

  public toshow: boolean = false;
  public icono_status : string = "chevron-down-outline";

  constructor(public router: Router) { }

  ngOnInit() { }

  show() {
    if (this.toshow) {
      this.toshow = false;
      this.icono_status = "chevron-down-outline";
    } else {
      this.toshow = true;
      this.icono_status = "chevron-up-outline";
    }
  }

  goTo(pageid: number) {
    switch (pageid) {
      case 1:
        this.router.navigate(["/coach"]);
        break;
      case 2:
        this.router.navigate(["/challenge-add"]);
        break;
      case 3:
        this.router.navigate([]);
        break;
      case 4:
        this.router.navigate(["/purpose"]);
        break;
      default:
        break;
    }
  }

}
