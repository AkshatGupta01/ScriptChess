var whiteSquareGrey = '#FC7343'
var blackSquareGrey = '#41190b'
var selectedSquare = '#010730'
var squareClass = 'square-55d63'
var hightlighTheme = localStorage.getItem("hightlight-theme");
if(!hightlighTheme) {
  hightlighTheme = "subtle";
}
var scrollStoppedForceFully = false;
function removeGreySquares (id) {
  if(hightlighTheme == 'subtle' || hightlighTheme == 'super-light')
    $("#"+id+' .square-55d63').css('opacity', '1')
  else
    $("#"+id+' .square-55d63').css('background', '')
}

function greySquare (square, id) {
  var $square = $("#"+id+' .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('cssText', function(i, v) {
    switch(hightlighTheme) {
      case "subtle":
        return this.style.cssText + ';opacity: '+0.4+' !important;'
      case "super-light":
        return this.style.cssText + ';opacity: '+0.8+' !important;'
      case "super-dark":
        return this.style.cssText + ';background: '+background+' !important;'
    }

  })
}

function highlightMoves(move, id) {
  var $board = $('#'+id)
  if (move.color === 'w') {
    $board.find('.' + squareClass).removeClass('highlight-white')
    $board.find('.square-' + move.from).addClass('highlight-white')
    squareToHighlight = move.to
    colorToHighlight = 'white'
  } else {
    $board.find('.' + squareClass).removeClass('highlight-black')
    $board.find('.square-' + move.from).addClass('highlight-black')
    squareToHighlight = move.to
    colorToHighlight = 'black'
  }
  $board.find('.square-' + squareToHighlight)
    .addClass('highlight-' + colorToHighlight);
}


function removeHighlights(boardId) {
  var $board = $('#'+boardId)
  $board.find('.highlight-white').removeClass('highlight-white')
  $board.find('.highlight-black').removeClass('highlight-black')
}
function stopScroll() {
  $('body').addClass("overflow");
}

function stopScrollForce() {
  scrollStoppedForceFully = true;
  $('body').addClass("overflow");
}

function resumedScrollForce() {
  scrollStoppedForceFully = false;
  $('body').removeClass("overflow");
  let scrollResumed = !$('body').hasClass("overflow");
}

function resumeScroll() {
  if(this.scrollStoppedForceFully)
    return
  $('body').removeClass("overflow");
}

function selectSquare(id,square) {
  var $square = $("#"+id+' .square-' + square)
  $square.addClass("selectedSquare")
}

function removeSelectSquare(id, square) {
  var $square = $("#"+id+' .square-' + square)
  $square.removeClass("selectedSquare")
}

function colorDominance(dominance, id) {
  let keys = Object.keys(dominance);
  keys.forEach(square=> {
    var $square = $("#"+id+' .square-' + square)
    if(dominance[square] == 0) {
      $square.removeClass('white-square')
      $square.removeClass('black-square')
      $square.addClass('gray-square')
    } else {
      if(dominance[square] > 0) {
        $square.removeClass('gray-square')
        $square.removeClass('black-square')
        $square.addClass('white-square')
      } else {
        $square.removeClass('white-square')
        $square.removeClass('gray-square')
        $square.addClass('black-square')
      }
    }
  })
}

function removeDominance(id) {
  let rank = [1,2,3,4,5,6,7,8];
  let file = ["a","b","c","d","e","f","g","h"];
  let squares = [];

  for(let i=0;i<8;i++) {
      for(let j=0;j<8;j++) {
          let square = file[j] + rank[i] ;
          squares.push(square);
      }
  }

    squares.forEach(s=> {
      var $square = $("#"+id+' .square-' + s)
      if($square.hasClass('white-square')) {
        $square.removeClass('white-square')
      } else {
        if($square.hasClass('black-square'))
          $square.removeClass('black-square')
        else
          $square.removeClass('gray-square')
      }
    })
}





