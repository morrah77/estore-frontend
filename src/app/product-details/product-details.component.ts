import {Component, Input} from '@angular/core';
import {Product} from "../models/product";
import {NgIf} from "@angular/common";
import {NgFor} from "@angular/common";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.less'
})
export class ProductDetailsComponent {
  @Input() product!: Product
  @Input() closeListener!: () => void
  @Input() addToCartListener!: (id: number, quantity: number) => void
  @Input() deleteFromCartListener!: (id: number) => void
  @Input() quantity!: number
  qValue: string = ''
  currentQuantity!: number
  totalPrice: number = 0
  currentImage: string = this.product?.images?.length > 0 ? this.product.images[0] : "assets/images/no_image.svg"

  ngOnInit() {
    if (this.product?.images?.length > 0) {
      this.setCurrentImage(this.product.images[0])
    }
    if (this.quantity) {
      this.qValue = String(this.quantity)
      this.setQuantity(this.qValue)
    }
  }

  setQuantity(quantity: string) {
    let parsed = parseInt(quantity, 10)
    if (isNaN(parsed)) {
      this.qValue = ''
      this.currentQuantity = 0
    } else {
      this.currentQuantity = parsed
    }
    this.totalPrice = this.currentQuantity * this.product?.price
  }

  setCurrentImage(src: string) {
    this.currentImage = src
  }

  isAddToCartDisabled() {
    return this.currentQuantity <= 0
  }

  isDeleteFromCartDisabled() {
    return this.quantity <= 0
  }

  addToCart(id: number, quantity: number) {
    this.setQuantity(`${quantity}`)
    this.addToCartListener(id, quantity)
    this.quantity = quantity
  }

  deleteFromCart(id: number) {
    this.setQuantity('')
    this.deleteFromCartListener(id)
    this.quantity = 0
  }

  handleInput(event: any) {
    console.dir(event)
  }
}
