import { Injectable, ElementRef } from '@angular/core';
import { ResizeObserver } from 'resize-observer';
import { Subject } from 'rxjs';
import { ResizeObserverEntry } from 'resize-observer/lib/ResizeObserverEntry';

@Injectable({
  providedIn: 'root'
})
export class ResizeObserverService {

  private _resizeObserver: ResizeObserver;

  observer$: Subject<ResizeObserverEntry[]> = new Subject();

  constructor() {
    this._resizeObserver = new ResizeObserver((entries) => {
      this.observer$.next(entries);
    });
  }

  observe(container: ElementRef | HTMLElement) {
    this._resizeObserver.observe(this._getNativeElement(container));
  }

  unobserve(container: ElementRef | HTMLElement) {
    this._resizeObserver.unobserve(this._getNativeElement(container));
  }

  private _getNativeElement(container: ElementRef | HTMLElement) {
    return typeof ElementRef ? (container as ElementRef).nativeElement : container;
  }
}
