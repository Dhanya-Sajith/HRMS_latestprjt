import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import flatpickr from 'flatpickr';

@Directive({
  selector: '[appDateRange]',
})
export class DateRangeDirective implements OnInit {
  @Input('appDateRange') dateRange: { start: Date; end: Date } = {
    start: new Date(),
    end: new Date(),
  };

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.initDatePicker();
  }

  private initDatePicker(): void {
    flatpickr(this.el.nativeElement, {
      minDate: this.dateRange.start,
      maxDate: this.dateRange.end,
      
    });
  }
}