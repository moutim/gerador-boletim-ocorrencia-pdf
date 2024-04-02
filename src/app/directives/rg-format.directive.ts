import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRgFormat]'
})
export class RgFormatDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const formattedValue = this.formatRg(value);
    this.ngControl?.control?.setValue(formattedValue);
  }

  private formatRg(value: string): string {
    if (!value) return value;

    let formattedValue = value.replace(/[^\dA-Z]/gi, '');

    if (formattedValue.length > 8) {
      formattedValue = formattedValue.substring(0, 8) + '-' + formattedValue.substring(8);
    }
    if (formattedValue.length > 5) {
      formattedValue = formattedValue.substring(0, 5) + '.' + formattedValue.substring(5);
    }
    if (formattedValue.length > 2) {
      formattedValue = formattedValue.substring(0, 2) + '.' + formattedValue.substring(2);
    }

    return formattedValue;
  }
}
