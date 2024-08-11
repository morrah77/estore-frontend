import {CatalogComponent} from "./catalog/catalog.component";
import {Observer} from "rxjs";
import {Product} from "./models/product";

export class ProductObserver implements Observer<Product[]> {
  constructor(private catalogComponent: CatalogComponent) {
  }
  next(value: Product[]) {
    this.catalogComponent.productRequestInProgress = true
    if (value.length < this.catalogComponent.productPageLength) {
      this.catalogComponent.noMoreProducts = true
    }
    if (!this.catalogComponent.products ||
      this.catalogComponent.previousSearchPhrase != this.catalogComponent.searchPhrase) {
      console.log(`${this.catalogComponent.previousSearchPhrase} != ${this.catalogComponent.searchPhrase}`)
      this.catalogComponent.products = value
      return
    }
    this.catalogComponent.products.push(...value)
  }
  error(err: any) {
    console.log("Error")
    console.dir(err)
  }
  complete() {
    this.catalogComponent.productRequestInProgress = false
  }
}
