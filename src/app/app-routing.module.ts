import { NgModule } from "@angular/core";
import {
  PreloadAllModules,
  RouterModule,
  Routes,
} from "@angular/router";

import { AuthGuard } from "./guards/auth.guard";
import { IsLoggedGuard } from "./guards/is-logged.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
    canLoad: [IsLoggedGuard],
    canActivate: [IsLoggedGuard],
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: "help-center",
    loadChildren: () =>
      import("./pages/help-center/help-center.module").then(
        (m) => m.HelpCenterPageModule
      ),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: "interest-information",
    loadChildren: () =>
      import("./pages/interest-information/interest-information.module").then(
        (m) => m.InterestInformationPageModule
      ),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: "terms",
    loadChildren: () =>
      import("./pages/terms/terms.module").then((m) => m.TermsPageModule),
  },
  {
    path: "policies",
    loadChildren: () =>
      import("./pages/policies/policies.module").then(
        (m) => m.PoliciesPageModule
      ),
  },
  {
    path: "blog-details",
    loadChildren: () =>
      import("./pages/blog-details/blog-details.module").then(
        (m) => m.BlogDetailsPageModule
      ),
  },
  {
    path: "onboarding",
    loadChildren: () =>
      import("./pages/onboarding/onboarding.module").then(
        (m) => m.OnboardingPageModule
      ),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./pages/user/profile/profile.module").then(
        (m) => m.ProfilePageModule
      ),
  },
  {
    path: "lifestyle",
    loadChildren: () =>
      import("./pages/lifestyle/lifestyle.module").then(
        (m) => m.LifestylePageModule
      ),
  },
  {
    path: "wellness/:segment",
    loadChildren: () =>
      import("./pages/wellness/wellness.module").then(
        (m) => m.WellnessPageModule
      ),
      pathMatch: 'full'
  },
  {
    path: "body",
    loadChildren: () =>
      import("./pages/body/body.module").then((m) => m.BodyPageModule),
  },
  {
    path: "feeling",
    loadChildren: () =>
      import("./pages/feeling/feeling.module").then((m) => m.FeelingPageModule),
  },
  {
    path: "not-connection",
    loadChildren: () =>
      import("./pages/not-connection/not-connection.module").then(
        (m) => m.NotConnectionPageModule
      ),
  },
  {
    path: "activities",
    loadChildren: () =>
      import("./pages/activities/activities.module").then(
        (m) => m.ActivitiesPageModule
      ),
  },
  {
    path: "purpose",
    loadChildren: () =>
      import("./pages/purpose/purpose.module").then((m) => m.PurposePageModule),
  },
  {
    path: "purpose-description/:key",
    loadChildren: () =>
      import("./pages/purpose-description/purpose-description.module").then(
        (m) => m.PurposeDescriptionPageModule
      ),
  },
  {
    path: "activities",
    loadChildren: () =>
      import("./pages/activities/activities.module").then(
        (m) => m.ActivitiesPageModule
      ),
  },
  { 
    path: "coach",
    loadChildren: () =>
      import("./pages/coach/coach.module").then((m) => m.CoachPageModule),
  },
  {
    path: "purpose-add",
    loadChildren: () =>
      import("./pages/purpose-add/purpose-add.module").then(
        (m) => m.PurposeAddPageModule
      ),
  },
  {
    path: "maintenance",
    loadChildren: () =>
      import("./pages/maintenance/maintenance.module").then(
        (m) => m.MaintenancePageModule
      ),
  },
  {
    path: "notifications",
    loadChildren: () =>
      import("./pages/notifications/notifications.module").then(
        (m) => m.NotificationsPageModule
      ),
  },
  {
    path: "community",
    loadChildren: () =>
      import("./pages/community/community.module").then(
        (m) => m.CommunityPageModule
      ),
  },
  {
    path: "friend-profile",
    loadChildren: () =>
      import("./pages/friend-profile/friend-profile.module").then(
        (m) => m.FriendProfilePageModule
      ),
  },
  {
    path: "profile-data",
    loadChildren: () =>
      import("./pages/profile-data/profile-data.module").then(
        (m) => m.ProfileDataPageModule
      ),
  },
  {
    path: "challenge-description/:id",
    loadChildren: () =>
      import("./pages/challenge-description/challenge-description.module").then(
        (m) => m.ChallengeDescriptionPageModule
      ),
  },
  {
    path: "challenge-add",
    loadChildren: () =>
      import("./pages/challenge-add/challenge-add.module").then(
        (m) => m.ChallengeAddPageModule
      ),
  },
  {
    path: "update-widget-container/:docNumber",
    loadChildren: () =>
      import(
        "./pages/qr/update-widget-container/update-widget-container.module"
      ).then((m) => m.UpdateWidgetContainerPageModule),
  },
  {
    path: "history-widget-container/:docNumber",
    loadChildren: () =>
      import(
        "./pages/qr/history-widget-container/history-widget-container.module"
      ).then((m) => m.HistoryWidgetContainerPageModule),
  },
  {
    path: "symptom-widget-container/:flowType/:docNumber",
    loadChildren: () =>
      import(
        "./pages/qr/symptom-widget-container/symptom-widget-container.module"
      ).then((m) => m.SymptomWidgetContainerPageModule),
  },
  {
    path: "advice-widget-container/:color/:docNumber",
    loadChildren: () =>
      import(
        "./pages/qr/advice-widget-container/advice-widget-container.module"
      ).then((m) => m.AdviceWidgetContainerPageModule),
  },
  {
    path: "wearables",
    loadChildren: () =>
      import("./pages/wearables/wearables.module").then(
        (m) => m.WearablesPageModule
      ),
  },
  {
    path: 'sleep',
    loadChildren: () => import('./pages/sleep/sleep.module').then( m => m.SleepPageModule)
  },
  {
    path: 'register-manual-activity',
    loadChildren: () => import('./pages/register-manual-activity/register-manual-activity.module').then( m => m.RegisterManualActivityPageModule)
  },
  {
    path: 'wellness-info',
    loadChildren: () => import('./pages/wellness-info/wellness-info.module').then( m => m.WellnessInfoPageModule)
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
