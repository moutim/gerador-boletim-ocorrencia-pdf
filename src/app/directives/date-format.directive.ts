import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const formattedValue = this.formatDate(value);
    this.ngControl?.control?.setValue(formattedValue);
  }

  private formatDate(value: string): string {
    if (!value) return value;

    let formattedValue = value.replace(/\D/g, '');
    if (formattedValue.length > 2) {
      formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2)}`;
    }
    if (formattedValue.length > 5) {
      formattedValue = `${formattedValue.substring(0, 5)}/${formattedValue.substring(5)}`;
    }
    return formattedValue;
  }
}
