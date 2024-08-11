import {Component, Input} from '@angular/core';
import {Category} from "../models/category";
import {NgFor, NgClass} from "@angular/common";

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.less'
})
export class CatalogHeaderComponent {
  @Input() categories!: Category[]
  @Input() selectedCategoryIds!: number[]
  @Input() categoryClickListener!: (id: number) => void
  @Input() allCategoriesClickListener!: () => void
  @Input() searchInputListener!: (phrase: string) => void
  phrase!: string

  isAll() {
    return this.selectedCategoryIds.length <= 0
  }
  isActive(item: Category): boolean {
    return this.selectedCategoryIds.length > 0 && this.selectedCategoryIds.indexOf(item.id) >= 0
  }
}
