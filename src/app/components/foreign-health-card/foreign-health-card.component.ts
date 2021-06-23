import { Component, Input } from "@angular/core";
import { IHealthCard } from "@app/interfaces/health-card.interface";

@Component({
  selector: "app-foreign-health-card",
  templateUrl: "./foreign-health-card.component.html",
  styleUrls: ["./foreign-health-card.component.scss"],
})
export class ForeignHealthCardComponent {
  @Input() data: IHealthCard;

  get imageType(): string {
    return this.data.tipoCarnet.toLowerCase();
  }

  get frontImage(): string {
    return `assets/health-card/${this.imageType}-health-card-front.png`;
  }

  get backImage(): string {
    return `assets/health-card/${this.imageType}-health-card-back.png`;
  }
}
