import {Component, Input} from '@angular/core';
import {CartProductEntity} from "../models/cart-product-entity";
import {NgFor, NgIf} from "@angular/common";

@Component({
  selector: 'app-ordered-product',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './ordered-product.component.html',
  styleUrl: './ordered-product.component.less'
})
export class OrderedProductComponent {
  @Input() entity!: CartProductEntity
  @Input() quantityChangeListener!: (id: number, quantity: number) => void
  @Input() deleteFromCartListener!: (id: number) => void
  public productImage: string = this.entity?.product?.images?.length > 0 ? this.entity.product.images[0] :
    "assets/images/no_image.svg"
  public qValue: string = ''
  public totalPrice!: number
  public displayProductPrice!: string
  public isNotDeleted: boolean = true

  ngOnInit() {
    if (this.entity?.product?.images?.length > 0) {
      this.productImage = this.entity.product.images[0]
    }
    if (this.entity.quantity) {
      this.qValue = String(this.entity.quantity)
    }
    this.updateDisplayProductPrice()
    this.updateTotalPrice()
  }

  setQuantity(quantity: string) {
    let parsed = parseInt(quantity, 10)
    if (isNaN(parsed)) {
      this.qValue = ''
      this.entity.quantity = 0
    } else {
      this.entity.quantity = parsed
    }
    this.updateTotalPrice()
  }

  updateTotalPrice() {
    this.totalPrice = this.entity.quantity * this.entity.product?.price
  }

  updateDisplayProductPrice() {
    this.displayProductPrice = this.entity.product.numberInStock > 0 ? `Price: $${this.entity.product.price}`
      : 'Out of stock'
  }

  isUpdateCartDisabled() {
    return this.entity.quantity <= 0
  }

  isDeleteFromCartDisabled() {
    return this.entity.quantity <= 0
  }

  deleteFromCart(id: number) {
    this.setQuantity('')
    this.deleteFromCartListener(id)
    this.clear()
  }

  clear() {
    this.isNotDeleted = false
  }
}
