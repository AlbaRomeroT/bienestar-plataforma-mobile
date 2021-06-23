import { Purpose } from "./../../interfaces/purpose.interface";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { StoreService } from "../../services/store.service";

@Component({
  selector: "app-purpose-selected",
  templateUrl: "./purpose-selected.component.html",
  styleUrls: ["./purpose-selected.component.scss"],
})
export class PurposeSelectedComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() purpose: Purpose;
  @Output() onRemove = new EventEmitter<Purpose>();

  constructor(private router: Router, private store: StoreService) {}

  ngOnInit() {
    console.log("purpose", this.purpose);
  }

  navigateTo() {
    this.router.navigate([`purpose-description/${this.purpose.message}`]);
  }

  remove() {
    this.onRemove.emit(this.purpose);
  }
}
