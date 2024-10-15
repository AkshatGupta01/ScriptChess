import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movePercent'
})
export class MovePercentPipe implements PipeTransform {

  transform(movesGameCount: number, totalCount: number): unknown {

    return ((movesGameCount / totalCount) * 100).toFixed(1);
  }

}
