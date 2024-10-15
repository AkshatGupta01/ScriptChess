import { Pipe, PipeTransform } from '@angular/core';
import { gameTypes as  gameCats} from 'src/app/static-data/game-types';
@Pipe({
  name: 'formatGameType'
})
export class GameTypeFormatterPipe implements PipeTransform {
  gameTypes = gameCats

  transform(value: string): unknown {
    this.gameTypes.forEach(t=> {
      if(t.value == value)
        value= t.name
    })
    return value;
  }

}
