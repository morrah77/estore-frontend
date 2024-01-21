import {Component, Input} from '@angular/core';
import {Product} from "../models/product";
import {Order} from "../models/order";
import {NgFor, NgIf} from "@angular/common";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './order.component.html',
  styleUrl: './order.component.less'
})
export class OrderComponent {
  @Input() order!: Order
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
}
