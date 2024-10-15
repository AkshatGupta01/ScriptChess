import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movecat'
})
export class MovecatPipe implements PipeTransform {

  transform(value: string): string {
    switch(value) {
      case "BOOK_MOVE":
        return "book.png";
      case "BEST":
        return "best.png";
      case "DUBIOUS":
        return "dubious.png";
      case "BLUNDER":
        return "blunder.png";
      case "GOOD_MOVE":
        return "good.png";
      case "BRILLIANT":
        return "brilliant.png";
    }

    switch(value+"") {
      case "3":
        return "book.png";
      case "1":
        return "good.png";
      case "2":
        return "best.png";
      case "4":
        return "dubious.png";
      case "6":
        return "blunder.png";
      case "0":
        return "brilliant.png";
      case "5":
        return "mistake.png";
    }
    return null;
  }

}
