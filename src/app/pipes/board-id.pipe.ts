import { Pipe, PipeTransform } from '@angular/core';
import { generateRandomID } from '../util/strings';

@Pipe({
  name: 'boardId'
})
export class BoardIdPipe implements PipeTransform {

  transform(value: string): string {
    return value + generateRandomID(5).trim();
  }

}
