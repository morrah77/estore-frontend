import { Component } from '@angular/core';
import {Order} from "../models/order";
import {BackendService} from "../backend.service";
import {CartService} from "../cart.service";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {OrderComponent} from "../order/order.component";
import {NgFor, NgIf} from "@angular/common";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, OrderComponent, NgFor, NgIf],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.less'
})
export class OrdersComponent {
  orders!: Order[]

  constructor(private service: BackendService, private cart: CartService) {
    this.getAllOrders = this.getAllOrders.bind(this)
  }

  ngOnInit() {
    this.getAllOrders()
  }

  getAllOrders() {
    this.service.getOrders()
      .subscribe(res => {
        this.orders = res
      })
  }

  orderClickListener(id: number): void {
    console.log(`orderClickListener: order ${id} clicked!`)
  }

  buyProductAgainListener(id: number): void {
    console.log(`buyProductAgainListener: product ${id} clicked!`)
  }

}
