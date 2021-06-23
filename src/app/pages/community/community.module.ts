import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ComponentsModule } from "@app/components/components.module";
import { IonicModule } from "@ionic/angular";
import { CommunityPageRoutingModule } from "./community-routing.module";
import { CommunityPage } from "./community.page";
import { FriendRequestsPage } from "./friend-requests/friend-requests.page";
import { FriendSearchPage } from "./friend-search/friend-search.page";
import { MyFriendsComponent } from "./my-friends/my-friends.component";
import { RecentActivitiesPage } from "./recent-activities/recent-activities.page";
import { ChallengesPage } from "./challenges/challenges.page";
import { PipesModule } from "../../pipes/pipes.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [
    CommunityPage,
    MyFriendsComponent,
    FriendSearchPage,
    FriendRequestsPage,
    RecentActivitiesPage,
    ChallengesPage,
  ],
  providers: [ComponentsModule],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommunityPageModule {}
