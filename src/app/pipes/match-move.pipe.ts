import { Pipe, PipeTransform } from '@angular/core';
import { Move } from '../models/move';

@Pipe({
  name: 'matchMove'
})
export class MatchMovePipe implements PipeTransform {

  transform(value: Move, ...args: Move[]): unknown {
    let selectedMove = args[0]
    let lastPlayedMove = args[1];
    if(!lastPlayedMove && !selectedMove)
      return false;
    if(!selectedMove) {
      return value.playedBy == lastPlayedMove.playedBy && value.move == lastPlayedMove.move && value.moveNumber == lastPlayedMove.moveNumber
    } else {
      return value.playedBy == selectedMove.playedBy && value.move == selectedMove.move && value.moveNumber == selectedMove.moveNumber
    }
  }

}
