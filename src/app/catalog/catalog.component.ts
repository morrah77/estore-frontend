import { Component } from '@angular/core';
import {Product} from "../models/product";
import {BackendService} from "../backend.service";
import {NgFor} from "@angular/common";
import {NgIf} from "@angular/common";
import {CatalogHeaderComponent} from "../catalog-header/catalog-header.component";
import {ProductComponent} from "../product/product.component";
import {Category} from "../models/category";
import {ProductDetailsComponent} from "../product-details/product-details.component";
import {CartService} from "../cart.service";
import {debounceTime, distinctUntilChanged, Observable, Subject, zip} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CatalogHeaderComponent, ProductComponent, NgFor, NgIf, ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.less'
})
export class CatalogComponent {
  products!: Product[]
  categories!: Category[]
  selectedProduct: Product | null = null
  selectedProductQuantityInCart: number = 0
  searchInputEvents: Subject<string>
  constructor(private router: Router, private route: ActivatedRoute, private service: BackendService, private cart: CartService) {
    this.getAllProducts = this.getAllProducts.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
    this.search = this.search.bind(this)
    this.getProductDetails = this.getProductDetails.bind(this)
    this.closeProductDetails = this.closeProductDetails.bind(this)
    this.addToCart = this.addToCart.bind(this)
    this.deleteFromCart = this.deleteFromCart.bind(this)

    this.searchInputEvents = new Subject<string>()
  }
  ngOnInit() {
    this.getAllProducts()

    this.service.getCategories()
      .subscribe(res => {
        this.categories = res
      })

    this.service.getAccessToken().subscribe(
      res => {
      }
    )

    this.searchInputEvents.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
      .subscribe(phrase => this.doSearch(phrase))
  }

  selectCategory(id: number) {
    this.service.getProductsInCategory(id)
      .subscribe(res => {
        this.products = res
      })
  }

  getAllProducts() {
    this.service.getProducts()
      .subscribe(res => {
        this.products = res
      })
  }

  search(search: string) {
    this.searchInputEvents.next(search)
  }

  doSearch(search: string) {
    this.service.searchProducts(search)
      .subscribe(
        res => {
          this.products = res
        }
      )
  }

  getProductDetails(id: number) {
    zip([this.service.getProduct(id), this.cart.getProductQuantity(id)])
      .subscribe(res => {
        this.selectedProductQuantityInCart = (res[1] as number)
        this.selectedProduct = (res[0] as Product)
        // this.router.navigate([`products`, this.selectedProduct.id], {relativeTo: this.route})
      })
  }

  closeProductDetails() {
    this.selectedProduct = null
  }

  addToCart(id: number, quantity: number) {
    this.cart.updateProduct(id, quantity)
  }

  deleteFromCart(id: number)
  {
    this.cart.updateProduct(id, 0)
  }
}
