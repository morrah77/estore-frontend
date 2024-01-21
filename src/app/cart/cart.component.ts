import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {BackendService} from "../backend.service";
import {CartService} from "../cart.service";
import {Product} from "../models/product";
import {CartEntity} from "../models/cart-entity";
import {Observable, zip} from "rxjs";
import {CartProductEntity} from "../models/cart-product-entity";
import {NgFor, NgIf} from "@angular/common";
import {OrderedProductComponent} from "../ordered-product/ordered-product.component";
import {CartCheckoutComponent} from "../cart-checkout/cart-checkout.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, OrderedProductComponent, CartCheckoutComponent, NgIf, NgFor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.less'
})
export class CartComponent {
  orderedProducts!: CartProductEntity[]
  isEmpty: boolean = true
  constructor(private backend: BackendService, private cart: CartService) {
    this.updateQuantity = this.updateQuantity.bind(this)
    this.deleteFromCart = this.deleteFromCart.bind(this)
  }
  ngOnInit() {
    let productReqs: Observable<Product>[] = []
    let cartProducts: CartEntity[] = []
    this.cart.getProducts()
      .subscribe(res => {
        cartProducts = res
        cartProducts.forEach(value => {
          productReqs.push(this.backend.getProduct(value.productId))
        })
        zip(productReqs)
          .subscribe(res => {
            this.orderedProducts = (res as Product[])
              .map((value, index, arr) =>
                ({
                  product: value,
                  quantity: cartProducts.find(v => v.productId == value.id)?.quantity
                } as CartProductEntity))
            this.updateIsEmpty()
          })
      })
  }

  updateIsEmpty() {
    this.isEmpty = !this.orderedProducts || this.orderedProducts.length <= 0
  }

  updateQuantity(id: number, quantity: number) {
    this.cart.updateProduct(id, quantity)
  }

  deleteFromCart(id: number)
  {
    this.cart.updateProduct(id, 0)
    this.orderedProducts.splice(this.orderedProducts.findIndex(value => value.product.id == id), 1)
    this.updateIsEmpty()
  }

  checkOut() {
    console.log('Check out')
  }
}
