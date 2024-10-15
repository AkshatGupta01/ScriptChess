import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseEval'
})
export class ParseEvalPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
