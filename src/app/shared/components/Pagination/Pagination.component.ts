import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './Pagination.component.html',
  styleUrl: './Pagination.component.css',
})
export class PaginationComponent {
  pages = input<number>(1);
  currentPage = input<number>(1);

  activePage = linkedSignal(() => this.currentPage());

  pagesArray = computed(() => {
    return Array.from({ length: this.pages() }, (_, index) => index + 1);
  });
}
