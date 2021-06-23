import { Injectable } from "@angular/core";
import { QrInfo } from "@app/interfaces/QrInfo";
import { Activity } from "@app/models/dacadoo/activity";
import { BehaviorSubject, Observable } from "rxjs";
import { Purpose } from "../interfaces/purpose.interface";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  private _currentActivity: BehaviorSubject<Activity> = new BehaviorSubject(
    null
  );
  private _currentPurpose: BehaviorSubject<Purpose> = new BehaviorSubject(null);
  private _currentQrInfo: BehaviorSubject<QrInfo> = new BehaviorSubject(null);

  public readonly currentActivity: Observable<Activity> = this._currentActivity.asObservable();
  public readonly currentPurpose: Observable<Purpose> = this._currentPurpose.asObservable();
  public readonly currentQrInfo: Observable<QrInfo> = this._currentQrInfo.asObservable();

  getCurrentActivity(): Observable<Activity> {
    return this.currentActivity;
  }

  setCurrentActivity(activity: Activity) {
    console.log(this._currentActivity);
    return this._currentActivity.next(activity);
  }

  getCurrentPurpose(): Observable<Purpose> {
    return this.currentPurpose;
  }

  setCurrentPurpose(purpose: Purpose) {
    console.log(this._currentPurpose);
    this._currentPurpose.next(purpose);
  }

  getCurrentQrInfo(): Observable<QrInfo> {
    return this.currentQrInfo;
  }

  setCurrentQrInfo(qrInfo: QrInfo) {
    console.log(this._currentQrInfo);
    this._currentQrInfo.next(qrInfo);
  }
}
