import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ComponentMessageService {
  private _subject = new BehaviorSubject<any>("");

  constructor() {}

  sendObjectMessage(objectMessage: any): void {
    this._subject.next(objectMessage);
  }

  clearObjectMessage(): void {
    //this._subject.next();
  }

  getObjectMessage(): Observable<any> {
    return this._subject.asObservable();
  }
}
