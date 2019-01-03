import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTags: any): any[] {
    if(!items) return [];
    return items.filter( it => {
      return searchTags.tag== it["tag"]  || searchTags.items.some(function(location:any) {
       console.log(it["tag"])
        return location.tag == it["tag"]
      })
    });
   }
}