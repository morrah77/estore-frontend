import {Component, Input} from '@angular/core';
import {Product} from "../models/product";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIf],
  templateUrl: './product.component.html',
  styleUrl: './product.component.less'
})
export class ProductComponent {
  @Input() product!: Product
  @Input() clickListener!: (id: number) => void
}
