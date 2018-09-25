import { Directive, SkipSelf, ElementRef, OnDestroy, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { ResizeObserverService } from './resize-observer.service';
import { map, filter } from 'rxjs/operators';

export interface BreakpointChangedEvent {
  old: number;
  new: number;
}

export interface Breakpoint {
  minwidth: number;
  cssClass: string;
}

@Directive({
  selector: '[cqContainerQuery]',
})
export class ContainerQueryDirective implements OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('cqContainerQuery') breakpoints: Breakpoint[] = [];

  @Output() breakpointChanged: EventEmitter<BreakpointChangedEvent> = new EventEmitter<BreakpointChangedEvent>();

  private _currentBreakpoint: Breakpoint;

  constructor(
    @SkipSelf() private _parent: ElementRef,
    private _resizeObserverService: ResizeObserverService,
    private _renderer: Renderer2) {
    this._resizeObserverService.observe(this._parent);
    this._resizeObserverService.observer$.pipe(
      map((entries) => entries.find((entry) => entry.target === this._parent.nativeElement)),
      filter((entry) => !!entry)
    ).subscribe((entry) => {
      const sorted = [...this.breakpoints];
        let newBreakpoint: Breakpoint;
        let i = 0;
        if (sorted.length > 0) {
          while (i < sorted.length && sorted[i].minwidth < entry.contentRect.width) {
            newBreakpoint = sorted[i];
            i++;
          }

          if (newBreakpoint !== this._currentBreakpoint) {
            const oldValue = this._currentBreakpoint !== undefined ? this._currentBreakpoint.minwidth : null;
            const newValue = newBreakpoint !== undefined ? newBreakpoint.minwidth : null;
            this.breakpointChanged.emit({old: oldValue, new: newValue });
            this._currentBreakpoint = newBreakpoint;
            sorted.forEach((e) => { this._renderer.removeClass(this._parent.nativeElement, e.cssClass); });
            if (this._currentBreakpoint) {
              this._renderer.addClass(this._parent.nativeElement, this._currentBreakpoint.cssClass);
            }
          }
        }
    });
  }

  ngOnDestroy(): void {
    this._resizeObserverService.unobserve(this._parent);
  }

}


// breakpoints
// 200, 400, 600, 800
