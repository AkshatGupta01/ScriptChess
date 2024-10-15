import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'printMoves'
})
export class PrintMovesPipe implements PipeTransform {

  transform(value: string[]): string {
    let moveSeq = "";
    for(let index=1; index<=value.length; index++) {
      if(index % 2 != 0) {
        moveSeq = moveSeq + " " + index + " " + value[index -1]
      } else {
        moveSeq = moveSeq + " " + value[index -1]
      }      
    }
    return moveSeq;
  }

}
