import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  pagesArray(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onPageClick(page: number) {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
