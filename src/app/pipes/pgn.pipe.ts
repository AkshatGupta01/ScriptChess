import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pgn'
})
export class PgnPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {   
    return value.trim();
  }

}
