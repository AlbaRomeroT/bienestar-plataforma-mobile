import { SafeUrl } from "@angular/platform-browser";
import { DacadooObject } from "./dacadoo-object.interface";
import { Media } from "./media.interface";

export interface ChallengeResponse {
  data: Challenge[];
}

export interface Challenge {
  id?: string;
  valid?: boolean;
  name?: string;
  description?: string;
  hasTeams?: boolean;
  collection?: string;
  startTime?: string;
  endTime?: string;
  showTime?: string;
  participantCount?: number;
  teamCount?: number;
  media?: Media[];

  // to description screen
  joinUserId?: string;
  object?: DacadooObject;
  safeMediaUrl?: SafeUrl;
}

export interface ChallengeParticipant {
  id?: string;
  object?: DacadooObject;
}
