import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfFormat]'
})
export class CpfFormatDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const formattedValue = this.formatCpf(value);
    this.ngControl?.control?.setValue(formattedValue);
  }

  private formatCpf(value: string): string {
    if (!value) return value;

    let formattedValue = value.replace(/\D/g, '');

    if (formattedValue.length > 9) {
      formattedValue = formattedValue.substring(0, 9) + '-' + formattedValue.substring(9);
    }
    if (formattedValue.length > 6) {
      formattedValue = formattedValue.substring(0, 6) + '.' + formattedValue.substring(6);
    }
    if (formattedValue.length > 3) {
      formattedValue = formattedValue.substring(0, 3) + '.' + formattedValue.substring(3);
    }

    return formattedValue;
  }
}
