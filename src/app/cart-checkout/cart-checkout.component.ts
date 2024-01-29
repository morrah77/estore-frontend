import {Component, EventEmitter, Input, ViewChild} from '@angular/core';

import {loadStripe, Stripe, StripeEmbeddedCheckout} from "@stripe/stripe-js";
import {NgFor, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ConfigService} from "../config.service";
import {BackendService} from "../backend.service";
import {Config} from "../models/config";
import {CheckoutSessionSecret} from "../models/checkout-session-secret";
import {Order} from "../models/order";
import {StripeEmbeddedCheckoutOptions} from "@stripe/stripe-js/types/stripe-js/embedded-checkout";
import {CheckoutSession} from "../models/checkout-session";
import {CheckoutOrder} from "../models/checkout-order";

@Component({
  selector: 'app-cart-checkout',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './cart-checkout.component.html',
  styleUrl: './cart-checkout.component.less'
})
export class CartCheckoutComponent {
  // listen when caller is ready to order
  @Input() readyToOrderEmitter!: EventEmitter<boolean>
  // call when ready to order and delivery info is valid
  @Input() checkout!: (deliveryInfo: string) => void
  // listen to order created on checkout
  @Input() createdOrder!: EventEmitter<Order | undefined>
  // call then checkout is complete
  @Input() checkoutComplete!: () => void
  // set caller in progress when waiting for payment service response
  @Input() setInProgress!: (inProgress: boolean) => void
  // checkout Stripe embedded form object
  stripeEmbeddedCheckout!: StripeEmbeddedCheckout | null
  // payment Stripe session ID
  sessionId!: string

  deliveryInfoPlaceholder: string = "123 Main St. Buffalo NY 123456"
  isReadyToOrder: boolean = false
  order!: Order
  deliveryInfo!: string
  orderProcessingStatus!: string

  constructor(private config: ConfigService, private backend: BackendService) {
    this.checkOrderStatus = this.checkOrderStatus.bind(this)
    this.embeddedCheckoutComplete = this.embeddedCheckoutComplete.bind(this)
    this.destroyEmbeddedCheckoutObject = this.destroyEmbeddedCheckoutObject.bind(this)
    this.loadEmbeddedCheckout = this.loadEmbeddedCheckout.bind(this)
  }

  ngOnInit() {
    let stripe: Promise<void | Stripe>
    this.readyToOrderEmitter.subscribe(next => {
      this.isReadyToOrder = next
    })
    this.config.getConfig().subscribe(
      (cnf: Config) => {
        this.createdOrder.subscribe(
          (next: Order) => {
            if (!next) {
              this.orderProcessingStatus = ''
              return
            }
            this.order = next
            this.orderProcessingStatus = 'In progress'
              this.backend.createCheckoutSession({id: this.order.id} as CheckoutOrder)
              .subscribe(
                res => {
                  if (!res) {
                    this.orderProcessingStatus = ''
                    return
                  }
                  const clientSecret = res
                  this.sessionId = clientSecret?.client_secret.slice(0, clientSecret?.client_secret.indexOf('_secret_'))
                  console.log(`session ID: ${this.sessionId}`)
                  stripe = loadStripe(cnf.payments.stripe.apiKey)
                    .then(
                      (loadedStripe: Stripe | null) => {
                        if (!loadedStripe) {
                          throw new Error(`Stripe object is ${loadedStripe}`)
                        }
                        this.loadEmbeddedCheckout(loadedStripe, clientSecret)
                        return loadedStripe
                      },
                      err => {
                        console.dir(err)
                        return
                      }
                    )
                })
          })
      })
  }

  ngOnDestroy() {
    console.log('ngOnDestroy')
    if (this.stripeEmbeddedCheckout) {
      this.destroyEmbeddedCheckoutObject()
    }
  }

  isPlaceOrderDisabled() {
    return !this.isReadyToOrder && this.deliveryInfo.length <= 0
  }

  placeOrder() {
    this.orderProcessingStatus = 'Started'
    this.checkout(this.deliveryInfo)
  }

  loadEmbeddedCheckout(loadedStripe: Stripe, clientSecret: CheckoutSessionSecret | undefined) {
    loadedStripe.initEmbeddedCheckout(
      {clientSecret: clientSecret?.client_secret, onComplete: this.embeddedCheckoutComplete} as StripeEmbeddedCheckoutOptions)
      .then(embeddedCheckout => {
        this.stripeEmbeddedCheckout = embeddedCheckout
        embeddedCheckout.mount('#embedded-checkout-container')
      })
  }

  checkOrderStatus() {
    if (!this.sessionId) {
      this.orderProcessingStatus = ''
      return
    }
    this.backend.getCheckoutSessionStatus(this.sessionId).subscribe(
      (next: CheckoutSession | undefined) => {
        console.log(`Checked order status:`)
        console.dir(next)

        if (next?.status) {
          this.orderProcessingStatus = next.status
          console.log('Status: next.status')
          return
        }
        this.orderProcessingStatus = 'Something went wrong'
      }
    )
  }

  embeddedCheckoutComplete() {
    console.log('embeddedCheckoutComplete')
    this.checkOrderStatus()
    this.destroyEmbeddedCheckoutObject()
    console.dir(this.checkoutComplete)
    console.log('Calling this.checkoutComplete...')
    this.checkoutComplete()
    console.log('Called this.checkoutComplete')
  }

  destroyEmbeddedCheckoutObject() {
    this.stripeEmbeddedCheckout?.unmount()
    this.stripeEmbeddedCheckout?.destroy()
    this.stripeEmbeddedCheckout = null
  }

  getKeyList(arg: {[p: string]: any} | null | undefined): string[] {
    if (!arg) {
      return []
    }
    return Object.keys(arg)
  }

  getStringValue(arg: any) {
    console.dir(arg)
    return arg.toString()
  }

  getDisplayValue(arg: any) {
    let stringValue = this.getStringValue(arg)
    switch (stringValue) {
      case 'required':
        return 'The field must not be empty!'
      case 'pattern':
        return `The field contents must match common mailing address pattern. Example: '${this.deliveryInfoPlaceholder}'`
      default:
        return 'Error'
    }
  }
}
