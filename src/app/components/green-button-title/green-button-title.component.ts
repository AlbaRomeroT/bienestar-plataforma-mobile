import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-green-button-title",
  templateUrl: "./green-button-title.component.html",
  styleUrls: ["./green-button-title.component.scss"],
})
export class GreenButtonTitleComponent implements OnInit {
  @Input() public title: string;

  @Input() private modal: HTMLIonModalElement;

  @Input() public showBack: boolean;

  @Output() private onBack: EventEmitter<any> = new EventEmitter();

  @Output() private onDismiss: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  closeModal() {
    this.onDismiss.emit();
  }

  isBackClicked() {
    this.onBack.emit([]);
  }
}
