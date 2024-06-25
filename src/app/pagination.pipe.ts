import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagination'
})
export class PaginationPipe implements PipeTransform {
  transform(items: any[], currentPage: number, itemsPerPage: number): any[] {
    if (!items || !items.length) {
      return [];
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);

    return items.slice(startIndex, endIndex);
  }
}
