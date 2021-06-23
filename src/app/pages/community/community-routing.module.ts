import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CommunityPage } from "./community.page";
import { FriendRequestsPage } from "./friend-requests/friend-requests.page";
import { FriendSearchPage } from "./friend-search/friend-search.page";

const routes: Routes = [
  {
    path: "",
    component: CommunityPage,
  },
  {
    path: "friend-search",
    component: FriendSearchPage,
  },
  {
    path: "friend-requests",
    component: FriendRequestsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityPageRoutingModule {}
