import {Component, Input} from '@angular/core';
import {Product} from "../models/product";
import {Order} from "../models/order";
import {NgFor, NgIf, DatePipe, CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CurrencyPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.less'
})
export class OrderComponent {
  @Input() order!: Order
  @Input() products!: Product[]
  @Input() clickListener!: (id: number) => void
  @Input() buyAgainListener!: (id: number) => void
  public orderTitle: string = ''
  public totalItems!: number

  ngOnInit() {
    this.orderTitle = `ID: ${this.order?.id}, created ${this.order?.dateCreated.toLocaleString()}, updated ${this.order?.dateUpdated}, status ${this.order?.status}`
    this.totalItems = this.order.products
      .map((v, i, a) => v.quantity).
      reduce((prev, curr, ind, arr) => prev + curr, 0)
  }

  getProductImage(productId: number) : string | undefined {
    let product =  this.products?.find(p => p.id == productId)
    return product?.images?.length ? product?.images?.at(0) : "assets/images/no_image.svg"
  }
}
