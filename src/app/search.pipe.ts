import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();
    return value.filter((item: any) => {
      if (typeof item === 'string') {
        return item.toLowerCase().startsWith(args);
      }
      return Object.values(item).some((value: any) => {
        if (typeof value === 'string') {
          return value.toLowerCase().startsWith(args);
        }
        return false;
      });
    });
  } 

}