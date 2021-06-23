import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor() {}

  async set(key: string, value: any): Promise<void> {
    localStorage.setItem(key, value);
  }

  async get(key: string): Promise<any> {
    const item = localStorage.getItem(key);
    return item;
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}
