export interface Notifications {
  lead: string;
  modificationTime: string;
  source: string;
  body: string;
  object: objectBody;
}

export interface objectBody {
  id: string;
}
