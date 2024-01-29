import {Component, EventEmitter, Output} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {BackendService} from "../backend.service";
import {CartService} from "../cart.service";
import {Product} from "../models/product";
import {CartEntity} from "../models/cart-entity";
import {Observable, tap, zip} from "rxjs";
import {CartProductEntity} from "../models/cart-product-entity";
import {NgFor, NgIf} from "@angular/common";
import {OrderedProductComponent} from "../ordered-product/ordered-product.component";
import {CartCheckoutComponent} from "../cart-checkout/cart-checkout.component";
import {Order} from "../models/order";
import {OrderedProduct} from "../models/ordered-product";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

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
  isReadyToOrder: boolean = false
  @Output() readyToOrderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() createdOrder: EventEmitter<Order | undefined> = new EventEmitter<Order | undefined>()
  isInProgress: boolean = false
  constructor(private router: Router, private route: ActivatedRoute,
              private backend: BackendService, private cart: CartService) {
    this.updateQuantity = this.updateQuantity.bind(this)
    this.deleteFromCart = this.deleteFromCart.bind(this)
    this.checkout = this.checkout.bind(this)
    this.checkoutComplete = this.checkoutComplete.bind(this)
    this.clearCart = this.clearCart.bind(this)
    this.setInProgress = this.setInProgress.bind(this)
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
    this.isReadyToOrder = !this.isEmpty &&
      !(this.orderedProducts.find(v => v.product.numberInStock < v.quantity || v.quantity <= 0)) &&
      this.backend.isSignedIn()
        this.readyToOrderEmitter.emit(this.isReadyToOrder)
  }

  updateQuantity(id: number, quantity: number) {
    this.cart.updateProduct(id, quantity)
    this.updateIsEmpty()
  }

  deleteFromCart(id: number)
  {
    this.cart.updateProduct(id, 0)
    this.orderedProducts.splice(this.orderedProducts.findIndex(value => value.product.id == id), 1)
    this.updateIsEmpty()
  }

  checkout(deliveryInfo: string) {
    let order = {
      products: [] as OrderedProduct[],
      totalPrice: 0,
      deliveryInfo: deliveryInfo
    } as Order
    let productTotalPrice
    for (let i = 0; i < this.orderedProducts.length; i++) {
      let p = this.orderedProducts[i]
      productTotalPrice = p.product.price * p.quantity
      order.products.push(
        {
          productId: p.product.id,
          // productName: p.product.title,
          quantity: p.quantity,
          totalPrice: productTotalPrice
        } as OrderedProduct
      )
      order.totalPrice += productTotalPrice
    }
    this.backend.addOrder(order)
      .subscribe((next: Order | undefined) => {
        console.log("Created an order")
        console.dir(next)
      this.createdOrder.emit(next)
    })
  }

  checkoutComplete() {
    console.log(`Checkout complete`)
    this.clearCart()
  }

  clearCart() {
    console.log(`Clearing cart`)
    let ids = this.orderedProducts.map(v => v.product.id)
    for (let i = 0; i < ids.length; i++) {
      this.deleteFromCart(ids[i])
    }
    this.updateIsEmpty()
    console.dir(this.orderedProducts)
  }

  setInProgress(inProgress: boolean) {
    this.isInProgress = inProgress
  }
}
