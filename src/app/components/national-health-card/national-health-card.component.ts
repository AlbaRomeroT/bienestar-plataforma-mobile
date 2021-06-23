import { Component, Input } from "@angular/core";
import { IHealthCard } from "@app/interfaces/health-card.interface";

@Component({
  selector: "app-national-health-card",
  templateUrl: "./national-health-card.component.html",
  styleUrls: ["./national-health-card.component.scss"],
})
export class NationalHealthCardComponent {
  @Input() data: IHealthCard;
  expanded: boolean = false;

  get imageType(): string {
    return this.data.tipoCarnet.toLowerCase().substring(0, 3);
  }

  get frontImage(): string {
    return `assets/health-card/${this.imageType}-health-card-front.png`;
  }

  get backImage(): string {
    return `assets/health-card/${this.imageType}-health-card-back.png`;
  }

  onExpandedClick(): void {
    this.expanded = !this.expanded;
  }
}
