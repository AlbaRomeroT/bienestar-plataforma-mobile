import { Component, OnInit, Input } from '@angular/core';
import { ToastService } from '@app/services/toast.service';
import { PointsService } from "../../services/points.service";

@Component({
  selector: "app-points-indicator",
  templateUrl: "./points-indicator.component.html",
  styleUrls: ["./points-indicator.component.scss"],
})
export class PointsIndicatorComponent implements OnInit {
  @Input() valor_puntos: number;
  theres_data: boolean;
  ready: boolean;
  current: number;
  max: number;
  nivel: string = "Básico";
  snivel: string = "Medio";

  constructor(
    private pointsService: PointsService,
    public toastService: ToastService
  ) {}

  ngOnInit() {
    this.theres_data = true;
    this.ready = true;
    this.getTotalPuntos();
  }

  graphWell() {
    this.current = this.valor_puntos;
    this.max = 100000;
  }

  getTotalPuntos() {
    this.graphWell();
    this.getMaximo(this.valor_puntos);
    this.getNivel(this.valor_puntos);
  }

  getNivel(valor_puntos) {
    if (valor_puntos <= 10000) {
      this.nivel = "Básico";
      this.snivel = "Medio";
    } else if (valor_puntos > 10000 && valor_puntos <= 60000) {
      this.nivel = "Medio";
      this.snivel = "Máster";
    } else {
      this.nivel = "Máster";
      this.snivel = "";
    }
  }

  getMaximo(valor_puntos) {
    if (valor_puntos < 10000) {
      this.max = 10000;
    } else if (valor_puntos >= 10000 && valor_puntos < 60000) {
      this.max = 60000;
    } else {
      this.max = 100000;
    }
  }
}
