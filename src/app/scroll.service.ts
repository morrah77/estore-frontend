import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  @Output() emitter: EventEmitter<number> = new EventEmitter<number>()
  scroll(delta: number) {
    // console.dir(`ScrollService scroll: ${delta}`)
    if (window.document.documentElement.scrollHeight - (window.document.documentElement.clientHeight + window.document.documentElement.scrollTop) < 30) {
      this.emitter.emit(delta)
    }
  }
}
