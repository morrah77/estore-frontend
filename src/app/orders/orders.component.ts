import { Component } from '@angular/core';
import {Order} from "../models/order";
import {BackendService} from "../backend.service";
import {CartService} from "../cart.service";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {OrderComponent} from "../order/order.component";
import {NgFor, NgIf} from "@angular/common";
import {Observable, zip} from "rxjs";
import {Product} from "../models/product";
import {CartProductEntity} from "../models/cart-product-entity";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, OrderComponent, NgFor, NgIf],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.less'
})
export class OrdersComponent {
  orders!: Order[]
  products!: Product[]

  constructor(private service: BackendService, private cart: CartService) {
    this.getAllOrders = this.getAllOrders.bind(this)
    this.buyProductAgainListener = this.buyProductAgainListener.bind(this)
  }

  ngOnInit() {
    this.getAllOrders()
  }

  getAllOrders() {
    let productReqs: Observable<Product>[] = []
    let productIds: number[] = []

    this.service.getOrders(null, null, 'date_created', 'desc')
      .subscribe(res => {
        this.orders = res
        let orderedProducts = this.orders.map(v => v.products)
        orderedProducts.forEach(v => productIds.push(
          ...(v.map(op =>op.productId).filter(op => !productIds.some(v => v == op)))
        ))
        productIds.sort()
        productIds.forEach(id => {
          productReqs.push(this.service.getProduct(id))
        })
        zip(productReqs)
          .subscribe(res => {
            this.products = (res as Product[])
          })
      })
  }

  orderClickListener(id: number): void {
    console.log(`orderClickListener: order ${id} clicked!`)
  }

  buyProductAgainListener(id: number): void {
    console.log(`buyProductAgainListener: product ${id} clicked!`)
    this.cart.updateProduct(id, 1)
  }

}
