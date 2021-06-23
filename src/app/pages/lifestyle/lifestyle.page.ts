import { Component, OnInit } from "@angular/core";
import { HealthScore } from "@app/models/health-score";
import { HealthScoreService } from "@app/services/health-score.service";

@Component({
  selector: "app-lifestyle",
  templateUrl: "./lifestyle.page.html",
  styleUrls: ["./lifestyle.page.scss"],
})
export class LifestylePage implements OnInit {
  public title: string;
  healthScoreData: HealthScore[];
  loadGraph = true;
  constructor(private healthScoreService: HealthScoreService) {
    this.title = "Hábitos";
  }

  ngOnInit() {}
  async ionViewDidEnter() {
    if (this.loadGraph) this.getHealthScoreHistorical();
  }
  getHealthScoreHistorical() {
    this.healthScoreService.getHealthScoreHistorical().subscribe((response) => {
      this.healthScoreData = response;
      console.log(this.healthScoreData);
    });
  }

  receiveMessage($event) {
    setTimeout(() => {
      this.loadGraph = false;
      this.getHealthScoreHistorical();
      this.loadGraph = true;
    }, 5000);
  }
}
