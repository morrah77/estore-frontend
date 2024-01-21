import { Directive } from '@angular/core';

@Directive({
  selector: '[appCurrency]',
  standalone: true
})
export class CurrencyDirective {

  constructor() { }

}
