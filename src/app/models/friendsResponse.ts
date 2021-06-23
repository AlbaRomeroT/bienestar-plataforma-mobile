export class FriendsResponse {
  next?: string;
  userIds?: string[];
  friendRequests?: FriendRequest[];
}

export class FriendRequest {
  id: string;
  relation: string;
  status: string;
}
