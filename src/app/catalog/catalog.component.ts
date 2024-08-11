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
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  ObservableInput,
  of,
  raceWith,
  Observer,
  Subject,
  switchMap,
  zip
} from "rxjs";
import {ActivatedRoute, OnSameUrlNavigation, Router, ParamMap, Data, UrlSegment} from "@angular/router";
import {ScrollService} from "../scroll.service";
import {ProductObserver} from "../product-observer";

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
  selectedProductID!: Observable<string | null>
  // selectedCategoriesParam!: Observable<string | null>
  productPageLength = 5
  productRequestInProgress: boolean = false
  productsObserver: Observer<Product[]> = new ProductObserver(this)
  noMoreProducts: boolean = false
  searchPhrase!: string
  previousSearchPhrase!: string
  selectedCategoryIds: number[] = []
  lastProductRequest: any

  constructor(private router: Router, private route: ActivatedRoute, private service: BackendService,
              private cart: CartService, private scroll: ScrollService) {
    this.getAllProducts = this.getAllProducts.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
    this.search = this.search.bind(this)
    this.getProductDetails = this.getProductDetails.bind(this)
    this.closeProductDetails = this.closeProductDetails.bind(this)
    this.addToCart = this.addToCart.bind(this)
    this.deleteFromCart = this.deleteFromCart.bind(this)
    this.getNavigationObject = this.getNavigationObject.bind(this)

    this.searchInputEvents = new Subject<string>()
  }

  ngOnInit() {
    this.getProducts()

    this.service.getCategories()
      .subscribe(res => {
        this.categories = res
      })

    this.service.getAccessToken()
      .subscribe(
      res => {
      }
    )

    this.searchInputEvents.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
      .subscribe(phrase => this.doSearch(phrase))

    // display selected product if any
    // TODO refactor this Observable/plain value mix to a more consistent state!
    this.selectedProductID = this.route.paramMap.pipe(
      switchMap((m: ParamMap) => of(m.get('product')))
    )

    // this.selectedCategoriesParam = this.route.paramMap.pipe(
    //   switchMap((m: ParamMap) => of(m.get('product')))
    // )
    //
    // this.selectedCategoriesParam?.subscribe(param => {
    //   if (param == null) {
    //     this.getAllProducts()
    //     return
    //   }
    //   let parsedIds: number[] = []
    //   param.split(',').forEach((s, i, a) => {
    //     let parsedID = parseInt(s, 10)
    //     if (!isNaN(parsedID)) {
    //       parsedIds.push(parsedID)
    //     }
    //   })
    //
    //   if (parsedIds.length <= 0) {
    //     this.router.navigate([{}])
    //     return;
    //   }
    //   this.selectedCategoryIds.splice(0, this.selectedCategoryIds.length)
    //   parsedIds.forEach((n, i, a) => {
    //     this.selectedCategoryIds.push(n)
    //   })
    //   this.getProducts()
    // })

    this.selectedProductID?.subscribe(id => {
      if (id == null) {
        return
      }
      let parsedID = parseInt(id, 10)
      if (isNaN(parsedID)) {
        this.router.navigate([{}])
        return;
      }
      this.getProductDetails(parsedID)
    })

    this.scroll.emitter.pipe(debounceTime(500)).subscribe(next => {
      this.scrollListener(next)
    })
  }

  selectCategory(id: number) {
    let ind = this.selectedCategoryIds.indexOf(id)
    if (ind >= 0) {
      this.selectedCategoryIds.splice(ind, 1)
    } else {
      this.selectedCategoryIds.push(id)
    }

    this.products = []
    this.noMoreProducts = false
    this.service.getProducts(0, this.productPageLength, this.selectedCategoryIds, this.searchPhrase)
      .subscribe(this.productsObserver)
    this.router.navigate(
      [{'category': this.selectedCategoryIds.join(',')}],)
  }

  getAllProducts() {
    this.products = []
    this.noMoreProducts = false
    this.selectedCategoryIds.splice(0, this.selectedCategoryIds.length)
    this.service.getProducts(0, this.productPageLength, this.selectedCategoryIds, this.searchPhrase)
      .subscribe(this.productsObserver)
    this.router.navigate(
      [this.getNavigationObject()],)
  }

  getNavigationObject(): any {
    let res = {}
    // if (this.selectedCategoryIds) {
    //   res.category =  this.selectedCategoryIds.join(',')
    // }
    // if (this.selectedProduct) {
    //   res.product =  this.selectedProduct.id
    // }
    return res
  }

  getProducts() {
    this.service.getProducts(this.products?.length || 0, this.productPageLength, this.selectedCategoryIds, this.searchPhrase)
      .subscribe(this.productsObserver)
  }

  search(search: string) {
    this.searchInputEvents.next(search)
  }

  doSearch(search: string) {
    if (this.previousSearchPhrase == search) {
      console.log("Search phrase not changed, no search...")
      return
    }
    this.previousSearchPhrase = this.searchPhrase
    this.searchPhrase = search
    this.noMoreProducts = false
    this.service.getProducts(0, this.productPageLength, this.selectedCategoryIds, this.searchPhrase)
      .subscribe(this.productsObserver)
  }

  getProductDetails(id: number) {
    zip([this.service.getProduct(id), this.cart.getProductQuantity(id)])
      .subscribe(res => {
        this.selectedProductQuantityInCart = (res[1] as number)
        this.selectedProduct = (res[0] as Product)

        //works worse than expected
        // this.router.navigate([{outlets: {popup: ['product', this.selectedProduct.id]}}])

        //mark the route with the product ID for a deep linking
        this.router.navigate(
          [{'product': this.selectedProduct.id}],{skipLocationChange: true})
      })
  }

  closeProductDetails() {
    this.selectedProduct = null
    this.router.navigate([{}])
  }

  addToCart(id: number, quantity: number) {
    this.cart.updateProduct(id, quantity)
  }

  deleteFromCart(id: number)
  {
    this.cart.updateProduct(id, 0)
  }

  scrollListener(delta: number) {
    this.previousSearchPhrase = this.searchPhrase
    if (this.productRequestInProgress) {
      console.log("Product request in progress...")
      return
    }
    if (this.noMoreProducts) {
      console.log(`No more products for category IDs ${this.selectedCategoryIds}, search phrase '${this.searchPhrase}'...`)
      return
    }
    console.dir(`Catalog: Scroll ${delta}`)
    this.service.getProducts(this.products.length, this.productPageLength, this.selectedCategoryIds, this.searchPhrase)
      .subscribe(this.productsObserver)
  }
}
