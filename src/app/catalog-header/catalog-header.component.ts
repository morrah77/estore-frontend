import {Component, Input} from '@angular/core';
import {Category} from "../models/category";
import {NgFor} from "@angular/common";

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [NgFor],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.less'
})
export class CatalogHeaderComponent {
  @Input() categories!: Category[]
  @Input() categoryClickListener!: (id: number) => void
  @Input() allCategoriesClickListener!: () => void
  @Input() searchInputListener!: (phrase: string) => void
  phrase!: string
}
