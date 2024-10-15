import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pieceOnSquare'
})
export class PieceOnSquarePipe implements PipeTransform {

  transform(pieceOnSquare: string): string {
    let markup = "";
    let piece = pieceOnSquare[0]

    return markup;
  }

}
