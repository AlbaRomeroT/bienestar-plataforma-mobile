import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
} from "@angular/core";
import { Chart } from "chart.js";
import { HealthScore } from "@app/models/health-score";

@Component({
  selector: "app-histogram-chart",
  templateUrl: "./histogram-chart.component.html",
  styleUrls: ["./histogram-chart.component.scss"],
})
export class HistogramChartComponent implements AfterViewInit, OnChanges {
  @ViewChild("lineCanvas")
  private lineCanvas: ElementRef;

  private months = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  @Input()
  public data: HealthScore[];

  @Input()
  public type: string;

  public lineChart: any;
  private gradientStroke: any;
  private ctx: any;

  constructor() {}

  ngAfterViewInit() {
    this.getContext();
    this.createGradient();
    this.createLineStyle();
  }

  ngOnChanges() {
    this.draw();
  }

  getContext() {
    this.ctx = this.lineCanvas.nativeElement.getContext("2d");
  }

  createGradient() {
    this.gradientStroke = this.ctx.createLinearGradient(0, 0, 0, 120);
    this.gradientStroke.addColorStop(0, "#3bd66f");
    this.gradientStroke.addColorStop(1, "#fddc07");
  }

  createLineStyle() {
    var ShadowLineElement = Chart.elements.Line.extend({
      draw: function () {
        var ctx = this._chart.ctx;
        var originalStroke = ctx.stroke;
        ctx.stroke = function () {
          ctx.save();
          ctx.shadowColor = "rgba(120,120,120,0.2)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 30;
          originalStroke.apply(this, arguments);
          ctx.restore();
        };
        Chart.elements.Line.prototype.draw.apply(this, arguments);
        ctx.stroke = originalStroke;
      },
    });
    Chart.defaults.ShadowLine = Chart.defaults.line;
    Chart.controllers.ShadowLine = Chart.controllers.line.extend({
      datasetElementType: ShadowLineElement,
    });
  }

  draw() {
    if (!this.data) return;

    let labels: string[] = [];
    let values: number[] = [];

    this.data.forEach((element) => {
      let date: Date = new Date(element.date.toString());
      labels.push(`${date.getUTCDate()} ${this.months[date.getUTCMonth()]}`);
      values.push(element.components[this.type]);
    });

    labels = labels.reverse();
    values = values.reverse();

    this.lineChart = new Chart(this.ctx, {
      type: "ShadowLine",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Puntuación hoy",
            fill: false,
            lineTension: 0.3,
            borderCapStyle: "round",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "round",
            pointBorderColor: "#ffe070",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "#0f7128",
            pointHoverBorderColor: "#0f7128",
            pointBorderWidth: 8,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10,
            data: values,
            spanGaps: false,
            backgroundColor: this.gradientStroke,
            borderColor: this.gradientStroke,
            borderWidth: 5,
            xAxisID: "x-axis",
            yAxisID: "y-axis",
            pointStyle: "circle",
          },
        ],
      },
      options: {
        title: {
          display: false,
        },
        legend: {
          display: false,
          labels: {
            defaultFontFamily: "Roboto Condensed",
          },
        },
        tooltips: {
          backgroundColor: "#fbfbfb",
          titleFontColor: "#333",
          bodyFontColor: "#333",
          footerFontColor: "#333",
          bodyAlign: "center",
          titleAlign: "center",
          footerAlign: "center",
          borderColor: this.gradientStroke,
          borderWidth: 1,
        },
        scales: {
          yAxes: [
            {
              id: "y-axis",
              offset: false,
              ticks: {
                stepSize: 20,
                minor: {
                  fontFamily: "Roboto Condensed",
                  fontColor: "#999999",
                },
              },
              gridLines: {
                display: true,
                lineWidth: 1,
                color: "#F4F4F4",
              },
            },
          ],
          xAxes: [
            {
              id: "x-axis",
              offset: true,
              gridLines: {
                display: false,
              },
              ticks: {
                stepSize: 20,
                minor: {
                  fontFamily: "Roboto Condensed",
                  fontColor: "#999999",
                },
              },
            },
          ],
        },
      },
    });
  }
}
