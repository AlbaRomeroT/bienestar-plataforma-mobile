import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "welcome",
  },
  {
    path: "welcome",
    loadChildren: () =>
      import("./welcome/welcome.module").then((m) => m.WelcomePageModule),
  },
  {
    path: "green-button",
    loadChildren: () =>
      import("./green-button/green-button.module").then(
        (m) => m.GreenButtonPageModule
      ),
  },
  {
    path: "porpuse",
    loadChildren: () =>
      import("./porpuse/porpuse.module").then((m) => m.PorpusePageModule),
  },
  {
    path: "qrpass",
    loadChildren: () =>
      import("./qrpass/qrpass.module").then((m) => m.QrpassPageModule),
  },
  {
    path: "health-indicator",
    loadChildren: () =>
      import("./health-indicator/health-indicator.module").then(
        (m) => m.HealthIndicatorPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingPageRoutingModule {}
