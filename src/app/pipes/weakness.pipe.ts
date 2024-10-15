import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weakness'
})
export class WeaknessPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch(value) {
      case "DOUBLED_PAWN":
          return "Doubled Pawns"
      case "TRIPPLED_PAWN":
          return "Trippled Pawns"
      case "ISOLATED_PAWN":
        return "Isolated Pawns"
      case "ISOLATED_PAWN_COUPLE":
        return "Isolated Pawns couple"
      case "OVERLOADED_PIECE":
        return "Overloaded piece"
      case "WEAK_SQUARE":
        return "Weak Squares"
      case "BROKEN_PAWN_IN_FRONT_OF_KING":
        return "Broken pawn structure near king"
      case "STOPPING_CASTLE":
        return "Stopping castle"
      case "HANGING_PIECE":
        return "Hanging Piece"
      case "WEAK_PAWN":
        return "Weak Pawns"
      case "PINNED_PIECE":
        return "Pinned Piece"
      case "OVER_EXTENDED_PAWN":
        return "Over extended Pawns"
      case "BAD_BISHOP":
        return "Bad Bishop"
    }
    return null;
  }

}
