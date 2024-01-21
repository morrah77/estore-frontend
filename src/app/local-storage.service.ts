import { Injectable } from '@angular/core';
import {LocalStorage} from "./models/local-storage";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly storage!: LocalStorage
  constructor() {
    try {
      if ((window as any).localStorage && (window as any).localStorage.setItem) {
        (window as any).localStorage.setItem('test', '1')
        let item: any = (window as any).localStorage.getItem('test')
        if (item == '1') {
          this.storage = (window as any).localStorage
          this.storage.removeItem('test')
          return
        }
      }
      this.storage = this.initObjectStorage()
    } catch (e: any) {
      console.error('Error: Could not use window local storage. Will use a JS object instead.')
      console.dir(e)
      this.storage = this.initObjectStorage()
    }
  }

  setItem(key: string, value: any): void {
    this.storage.setItem(key, value)
  }

  getItem(key: string): any {
    return this.storage.getItem(key)
  }

  removeItem(key: string): void {
    this.storage.removeItem(key)
  }

  clear(): void {
    this.storage.clear()
  }

  initObjectStorage(): LocalStorage {
    let storage = {
      s: new Map<string, any>(),
      setItem: function (key: string, value: any): void {
        storage.s.set(key, value)
      },
      getItem: function (key: string): any {
        return storage.s.get(key)
      },
      removeItem: function (key: string): void {
        storage.s.set(key, undefined)
      },
      clear: function (): void {
        storage.s.clear()
      }
    }
    return storage
  }
}
