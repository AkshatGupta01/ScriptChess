const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const FEN_REGEX_FOR_PIECES = "^((?=.*{1}))(([kK{2}1-8]{1,8}\\/?){8})\\s(b|w)\\s(-|K?Q?k?q)\\s(-|[a-h][3-6])\\s\\d+\\s\\d+$";
export function generateRandomID(length : number) {
    let result = 'b';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function generateRandomNumber(minVal : number, maxVal : number) {
    if(minVal == maxVal)
        return minVal;
    let rand = Math.ceil(Math.random() * 100);
    rand = rand % maxVal;
    if(rand < minVal)
        rand = minVal;
    return rand;
}

export function getFenRegex(pieces : string) {
  let piecesArr : string[]  = pieces.split(",");
  let pattern = "";
  piecesArr.forEach(p=> {
      pattern += (p.toLowerCase()+p.toUpperCase());
  })
  let mPattern = "";
  piecesArr.forEach(p=> {
      if(p.toLowerCase() == "p") {
          mPattern += "[" + (p.toLowerCase() + p.toUpperCase()) + "].*";
      } else {
          mPattern += "[" + (p.toLowerCase() + p.toUpperCase()) + "]{1}.*";
      }
  })
  return FEN_REGEX_FOR_PIECES.replace("{1}", mPattern).replace("{2}", pattern)
}

export function chooseRandomItemsFromArray(origArr : any[], targetArrLength : number) {
  let targetArr = []
  for(let index = 0; index < targetArrLength; index++) {
    let random = Math.random();
    random = Math.floor(random * origArr.length);
    targetArr.push(origArr[random])
  }

  return targetArr;

}

export function getMonth(numStr) {
  let num = Number.parseInt(numStr);
  switch(num) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
  }
}
