var boardId = 0;
var initCord;
var finalCord;
var isBlackOriented = {};

function setOrientation(black, id) {
  isBlackOriented[id] = black;
}

function loadArrowSupport(id) {
    boardId = id;
    const boardEl = document.getElementById(id);
    $("<svg viewBox='0 0 "+boardEl.clientWidth+" "+boardEl.clientHeight+"' class='svg-"+boardId+" svg-arrow'></svg>").insertAfter("#"+boardId)
    var fyles = ['a','b','c','d','e','f','g','h']

    board = findAbsolutePosition(boardEl);
    boardX= board.x;
    boardY= board.y;
    //var ratioX =  boardEl.clientWidth / 100;
    //var ratioY =  boardEl.clientHeight / 100;
    var ratioX = 1;
    var ratioY = 1;
    $("#"+id).mousedown(function(e) {
        if(e.button ==2) {

            initCord = {
                x : (e.clientX - e.currentTarget.getBoundingClientRect().left),
                y : (e.clientY - e.currentTarget.getBoundingClientRect().top)
            }

            //drawCircle(id, initCord.x,initCord.y)
            e.preventDefault();
        }
    })
    $("#"+id).mouseup(function(e) {
        if(e.button ==2) {
            finalCord = {
                x : (e.clientX - e.currentTarget.getBoundingClientRect().left),
                y : (e.clientY - e.currentTarget.getBoundingClientRect().top)
            }

            //drawCircle(id, finalCord.x,finalCord.y)
            mouseReleased(id, ratioX, ratioY)
        }
    })
    $("#"+id).bind("contextmenu",function(e){
        return false;
    });
}

function findAbsolutePosition(htmlElement) {
    var x = htmlElement.offsetLeft;
    var y = htmlElement.offsetTop;
    for (var x=0, y=0, el=htmlElement;
         el != null;
         el = el.offsetParent) {
           x += el.offsetLeft;
           y += el.offsetTop;
    }
    return {
        "x": x,
        "y": y
    };
  }

function mouseDown() {

}

function drawArrowBetweenSquare(firstSquare, lastSquare, id,color = "#979ba0") {
  connectSquares(firstSquare, lastSquare, id, color, "connect-square")
}

function connectSquares(firstSquare, lastSquare, id, color, className) {
    let board = document.getElementById(id);
    firstElement = document.getElementById(id).getElementsByClassName("square-"+firstSquare)
    lastElement = document.getElementById(id).getElementsByClassName("square-"+lastSquare)
    var firstCod = findAbsolutePosition(firstElement[0])
    var lastCod = findAbsolutePosition(lastElement[0])
    var boardCords = findAbsolutePosition(board)
    let width =  firstElement[0].clientWidth;
    width = width/2;
    firstCod.x = firstCod.x + width - boardCords.x;
    firstCod.y = firstCod.y + width - boardCords.y;
    lastCod.x = lastCod.x + width - boardCords.x;
    lastCod.y = lastCod.y + width - boardCords.y;
    drawArrow(firstCod.x, firstCod.y, lastCod.x,lastCod.y, id, color, className, firstSquare+"-" + lastSquare)
}

function removeArrowBetweenSquare(firstSquare, lastSquare, id) {
    let board = document.getElementById(id);
    firstElement = document.getElementById(id).getElementsByClassName("square-"+firstSquare)
    lastElement = document.getElementById(id).getElementsByClassName("square-"+lastSquare)
    var firstCod = findAbsolutePosition(firstElement[0])
    var lastCod = findAbsolutePosition(lastElement[0])
    var boardCords = findAbsolutePosition(board)
    let width =  firstElement[0].clientWidth;
    width = width/2;
    firstCod.x = firstCod.x + width - boardCords.x;
    firstCod.y = firstCod.y + width - boardCords.y;
    lastCod.x = lastCod.x + width - boardCords.x;
    lastCod.y = lastCod.y + width - boardCords.y;
    removePolyGon(firstCod.x, firstCod.y, lastCod.x,lastCod.y, id)
}

function removeAllSquareConnectingArrow(id) {
    removeSquares(id, "connect-square")
    removeSquares(id,  "square-cirlce")
}

function removeSquares(id, className) {
    const svg = document.querySelector(".svg-"+id);
    let classAnn = className;
    let polygons = svg.getElementsByClassName(classAnn)

    if(polygons.length > 0) {
       while(polygons.length > 0) {
        polygons[0].remove()
       }
    }
}

function drawCircle(id,x,y) {
    let boardElement = document.getElementById(id);
    const svg = document.querySelector(".svg-"+id);
	  var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    let squareName = getSquare(id,x,y)
    let square = boardElement.getElementsByClassName("square-" + squareName);
    if(square.length > 0) {
      let center = getCenterOfSquare(id, squareName)
      x = center.x;
      y = center.y;
      shape.setAttributeNS(null, "cx", x);
      shape.setAttributeNS(null, "cy", y);
      shape.setAttributeNS(null, "r",  ((square[0].clientWidth / 2) - 5));
      shape.setAttributeNS(null, "stroke", "#FC7343");
      shape.setAttributeNS(null, "fill", "none");
      shape.setAttributeNS(null, "stroke-width", "5");
      shape.setAttributeNS(null, "class", "square-cirlce");
      svg.appendChild(shape);
    }

}

function mouseReleased(id, ratioX, ratioY) {
    let x1 = initCord.x;
    let y1 = initCord.y;
    let x2 = finalCord.x;
    let y2 = finalCord.y;
    if(x1 == x2 && y1 == y2) {
      drawCircle(id, x1,y1)
    } else {
      drawArrow(x1, y1,x2,y2, id, "#FC7343", "connect-square")
    }
}

function getSquare(id, x1,y1) {
  let board = document.getElementById(id);
  board = board.getElementsByClassName("chessboard-63f37");
  if(board.length > 0) {
    board = board[0];
    let squareWidth = board.offsetWidth / 8;
    let squareHeight = board.offsetHeight / 8;
    let rank = 0;
    if(!isBlackOriented[id])
      rank =  (8 - Number.parseInt(y1/squareHeight));
    else
      rank = (Number.parseInt(y1/squareHeight) + 1);

    let file = Number.parseInt(x1/squareWidth) + 1;
    let squareName= "";
    switch(file) {
      case 1:
        if(!isBlackOriented[id])
          squareName = "a"+rank;
        else
          squareName = "h"+rank;
        break
      case 2:
        if(!isBlackOriented[id])
          squareName = "b"+rank;
        else
          squareName = "g" + rank;
        break
      case 3:
        if(!isBlackOriented[id])
          squareName = "c"+rank;
        else
          squareName = "f" + rank;
        break
      case 4:
        if(!isBlackOriented[id])
          squareName = "d"+rank;
        else
          squareName = "e" + rank;
        break
      case 5:
        if(!isBlackOriented[id])
          squareName = "e"+rank;
        else
          squareName = "d" + rank;
        break
      case 6:
        if(!isBlackOriented[id])
          squareName = "f"+rank;
        else
          squareName = "c" + rank;
        break
      case 7:
        if(!isBlackOriented[id])
          squareName = "g"+rank;
        else
          squareName = "b" + rank;
        break
      case 8:
        if(!isBlackOriented[id])
          squareName = "h"+rank;
        else
        squareName = "a"+rank;
        break
    }

    return squareName;
  }

}


function getCenterOfSquare(id,squareName)  {
  let boardElement = document.getElementById(id);
  let svgElement = document.getElementsByClassName("svg-"+id);
  svgElement = svgElement[0];
  boardElement = boardElement.getElementsByClassName("chessboard-63f37")
  if(boardElement.length > 0) {
    boardElement = boardElement[0]
    let square = boardElement.getElementsByClassName("square-" + squareName);
    let firstSquare = null;
    if(!isBlackOriented[id])
      firstSquare = boardElement.getElementsByClassName("square-a1");
    else
      firstSquare = boardElement.getElementsByClassName("square-h1");
    let x = (square[0].offsetLeft + (square[0].clientWidth /2 ) - firstSquare[0].offsetLeft);
    let y = (square[0].offsetTop + (square[0].clientHeight /2 ));
    return {
      x,y
    }
  }

}

function drawArrow(x1,y1,x2,y2,id, fillColor, exClass="", data="") {

    const svg = document.querySelector(".svg-"+id);
    var shape = document.createElementNS("http://www.w3.org/2000/svg",
                                         "polygon");
    let startSquareName = getSquare(id,x1,y1)
    let finishSquareName = getSquare(id,x2,y2)
    let startCenter = getCenterOfSquare(id, startSquareName)
    let finishCenter = getCenterOfSquare(id, finishSquareName)
    x1 = startCenter.x
    y1 = startCenter.y
    x2 = finishCenter.x
    y2 = finishCenter.y;

    let origX2 = x2;
    x2 = calculateLengthOfArrow(x1, y1,x2, y2) + x1;
    const thickness = 15;
    const arrowWidthOneSide = 10;
    Math.ta
    var pointers = [];
    let angle = 0;
    //from left to right
    if(x1 < x2) {
        const arrowNotchX= 20;
        const arrowNotchY= 5;
        //pointers.push([x1,y1-(thickness/2)]) //start
        pointers.push([x1,y1]) //start
        pointers.push([x2 - arrowNotchX,y1-(thickness/2)]) //end
        pointers.push([x2 - arrowNotchX,y1 - arrowWidthOneSide-(thickness/2)]) //arrow flank
        pointers.push([x2 - arrowNotchX+ arrowNotchX, y1 + arrowNotchY-(thickness/2)]) //arrow notch
        pointers.push([x2 -arrowNotchX , y1+arrowWidthOneSide + (thickness/2)]) //arrow flank
        pointers.push([x2 - arrowNotchX, y1 + (thickness/2)]) //end extend
        //pointers.push([x1, y1 + (thickness/2)]) //start extend
        angle = Math.atan2((y2-y1), (origX2-x1))* 180 / Math.PI;
        //drawCircle(id, x1,y1);
        //drawCircle(id, origX2,y2)
        //angle = Math.floor(angle)

    }



    for (value of pointers) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        shape.points.appendItem(point);
    }
    /*var path = "M "  + x1 + " " + y1 +
               " C " + hx1 + " " + hy1
                     + " "  + hx2 + " " + hy2
               + " " + x2 + " " + y2;*/
    //var points= x1+","+""
    //shape.setAttributeNS(null, "points", path);
    let classAnn = "pol-"+x1+"-"+y1+"-"+origX2+"-"+y2+" " + exClass;

    shape.setAttributeNS(null, "fill", fillColor);
    shape.setAttributeNS(null, "class", "arrow "+ classAnn + " " + data);
    shape.setAttributeNS(null, "transform", "rotate("+angle+" "+(x1)+" "+(y1)+")");
    shape.setAttributeNS(null, "style", "opacity:0.8");
    if(data && data != "") {
        shape.setAttribute("data", data);
    }
    svg.appendChild(shape);
}

function removePolyGon(x1,y1,x2,y2, id) {
    const svg = document.querySelector(".svg-"+id);
    let classAnn = "pol-"+x1+"-"+y1+"-"+x2+"-"+y2;

    let polygons = svg.getElementsByClassName(classAnn)
    if(polygons.length > 0) {
       for(let i=0;i<polygons.length;i++) {
        polygons[i].remove()
       }
    }
}



function calculateLengthOfArrow(x1, y1, x2, y2) {
    let lSq = Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2);
    return Math.floor(Math.sqrt(lSq));
}

function slope(points) {
    let a = points[0];
    let b = points[1];
    let c = points[2];
    let d = points[3];

    function findSlope(a, b, c, d) {
      if (c - a === 0) {
        return "undefined";
      } else if (c - a !== 0) {
        let slope = (d - b) / (c - a);
        let answer = slope.toString();
        return answer;
      } else {
        return "undefined";
      }
    }


}

function addClassification(square, classification) {
    removeClassiciation()
    let markup = "<img id='classification' class='move-class-annotation' src='/assets/images/" + classification + "' />"
    $(".square-" + square).prepend(markup)

}

function removeClassiciation() {
    $("img.move-class-annotation").remove();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function drawNetwork(matrix, position, id, onlyAttacks = false) {
    //removeNetwork(id);
    //filter
    let arrows = $(".web")
    let newConnections = {}
    if(!onlyAttacks) {
        matrix.black.details.forEach((data, index)=> {
            if(data.supportedPiece.length > 0) {
              data.supportedPiece.forEach(s=> {
                let className = data.origin+"-"+s;
                if($("." + className).length == 0) {
                  setTimeout(()=> {connectSquares(data.origin, s, id,"#11b109", "supported-pieces web"); }, 100 * index)
                }
                newConnections[className] = 1
              })
            }
          })

          matrix.white.details.forEach((data, index)=> {
              if(data.supportedPiece.length > 0) {
                  data.supportedPiece.forEach(s=> {
                      let className = data.origin+"-"+s;
                      if($("." + className).length == 0) {
                          setTimeout(()=> {connectSquares(data.origin, s, id,"#11b109", "supported-pieces web"); }, 100 * index)
                      }
                      newConnections[className] = 1
                  })
              }
          })
    }

    matrix.black.details.forEach((data, index)=> {
        if(data.attacking.length > 0) {
            data.attacking.forEach(s=> {
                let className = data.origin+"-"+s;
                if($("." + className).length == 0) {
                    setTimeout(()=> {connectSquares(data.origin, s, id,"#ab1e30", "attacked-pieces web"); }, 100 * index)
                }
                newConnections[className] = 1
            })
        }
    })

    matrix.white.details.forEach((data, index)=> {
        if(data.attacking.length > 0) {
            data.attacking.forEach(s=> {
                let className = data.origin+"-"+s;
                if($("." + className).length == 0) {
                    setTimeout(()=> {connectSquares(data.origin, s, id,"#ab1e30", "attacked-pieces web"); }, 100 * index)
                }
                newConnections[className] = 1
            })
        }
    })

    let keys = Object.keys(arrows);
    keys.forEach(key=> {
        let data = $(arrows[key]).attr("data");
        if(!newConnections[data]) {
            $(arrows[key]).remove()
        }
    })

}

function removeNetwork(id) {
    removeSquares(id, "attacked-pieces")
    removeSquares(id, "supported-pieces")
}


