
export interface BodyMessageLink {
  name?: string;
  route?: string;
  before?: string;
  after?: string;
  text?: string;
  mp3?: string;
  strong?: string;
}

export interface CoachBodyParagraph {
  content?: CoachBodyContent[];
}

export interface CoachBodyContent {
  type?: "link" | "text" | "mp3" | "strong";
  url?: string;
  text?: string;
}