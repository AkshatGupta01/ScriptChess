

import { isMove, isMoveNumber } from "../util/chessjsutil";
import { Move } from "./move";

export class MoveCollection {
    
    private startMove : Move
    private lastPlayedMove : Move

    getMoveArray() : Move[] {
        if(!this.startMove)
            return [];
        return this.getSubMoveArray(this.startMove);    
    }

    private getSubMoveArray(move : Move) : Move[]{
        let moves : Move[] = []
        while(true) {
            moves.push(move);
            if(move.next) {                 
                if(move.sideMovesArray) {
                    let sideMovesArray = [];
                    move.sideMovesArray.forEach(array => {
                        sideMovesArray.push(this.getSubMoveArray(array[0]))
                    })
                    move.sideMovesArray = sideMovesArray;
                }
                move = move.next
            } else {
                if(move.sideMovesArray) {
                    let sideMovesArray = [];
                    move.sideMovesArray.forEach(array => {
                        sideMovesArray.push(this.getSubMoveArray(array[0]))
                    })
                    move.sideMovesArray = sideMovesArray;
                }
                move = move.next
                break
            }
        }
        return moves;
    }

    addMove(move : Move) {
        if(!this.startMove) {
            this.startMove = move;
            this.lastPlayedMove = move;
        } else {
            if(!this.lastPlayedMove) {
                this.lastPlayedMove = this.startMove;
                return
            }
            if(this.lastPlayedMove.next) {
                if(this.lastPlayedMove.next.move == move.move && this.lastPlayedMove 
                    && this.lastPlayedMove.next.moveNumber == move.moveNumber
                    && this.lastPlayedMove.next.playedBy == move.playedBy) {
                        this.lastPlayedMove = this.lastPlayedMove.next;
                       return 
                } else {
                    if(this.lastPlayedMove.next.sideMovesArray) {
                        let sideMoveSeqFound= false;
                        let firstSideMove = null;
                        for(let index = 0; index<this.lastPlayedMove.next.sideMovesArray.length; index++) {
                            firstSideMove = this.lastPlayedMove.next.sideMovesArray[index][0]
                            if(firstSideMove.move == move.move 
                                && firstSideMove.moveNumber == move.moveNumber
                                && firstSideMove.playedBy == move.playedBy) {
                                    sideMoveSeqFound = true;
                                break;    
                            }
                        }
                        if(sideMoveSeqFound) {
                            this.lastPlayedMove = firstSideMove;
                            return
                        }
                        this.lastPlayedMove.next.sideMovesArray.push([])
                        this.lastPlayedMove.next.sideMovesArray[this.lastPlayedMove.next.sideMovesArray.length -1].push(move)        
                        //this.lastPlayedMove.next = move;
                        move.prev = this.lastPlayedMove;
                        this.lastPlayedMove = move;
                        move.isSideMove = true;
                    } else {                        
                        this.lastPlayedMove.next.sideMovesArray = []
                        this.lastPlayedMove.next.sideMovesArray.push([])
                        this.lastPlayedMove.next.sideMovesArray[0].push(move)
                        move.prev = this.lastPlayedMove;
                        this.lastPlayedMove = move;
                        move.isSideMove = true;
                    }
                }
            } else {
                if(this.lastPlayedMove.isSideMove) {
                    move.isSideMove = true
                }
                this.lastPlayedMove.next = move;
                move.prev = this.lastPlayedMove;
                this.lastPlayedMove = move;
                if(this.lastPlayedMove.comment) {
                    let comment = this.lastPlayedMove.comment;
                    this.lastPlayedMove.comment = null;
                    let sideMoves = this.getMovesFromComment(comment, 0, comment.length, this.lastPlayedMove)
                    if(sideMoves.length > 0) {
                        if(!this.lastPlayedMove.sideMovesArray)
                            this.lastPlayedMove.sideMovesArray = []
                        sideMoves.forEach(a=> {
                            this.lastPlayedMove.sideMovesArray.push(a);
                        })    
                        
                    }                    
                }
            }
            
        }
    }

    setLastPlayedMove(move) {
        this.lastPlayedMove = move;
    }

    getLastPlayedMove() {
        return this.lastPlayedMove;
    }
    createMoveSequence(move) {
        let moves = []
        while(true) {
            moves.push(move);
            if(!move.prev) {
                break;
            } else {
                move = move.prev;
            }
        }
        moves = moves.reverse();
        return moves;
    }

    reset() {
        this.lastPlayedMove = null;
    }

    getMovesFromComment(comment : string, start, end, move) {
        let iComment = comment.substring(start, end);
        let allSideMoves : Move[][]= [];
        let moves : Move[] = [];
        let sideLineCompleted = false;
        if(comment.indexOf("(") > -1) {
            let currentMove = null;
            let currentToken = "";
            for(let index =start; index < iComment.lastIndexOf(")"); index++) {
                if(iComment.charAt(index) == '(' ) {
                    if(currentMove) {
                        let subCommentEndsOn = iComment.indexOf(")", index);
                        let subMoves = this.getMovesFromComment(comment, index, subCommentEndsOn, currentMove);                        
                    } else
                        continue
                    
                } else {
                    if(iComment.charAt(index) == ' ') {
                        if(isMoveNumber(currentToken)) {
                            let parts = currentToken.split(".");
                            let playedBy = parts.length == 3 ? 1 : 0;
                            let number = parts.join("");                            
                            if(!currentMove) {
                                currentMove = {
                                    moveNumber : Number.parseInt(number), 
                                    playedBy,
                                    prev : move.prev
                                }
                            } else {
                                let tmp =  {
                                    moveNumber : Number.parseInt(number), 
                                    playedBy,
                                    prev  : sideLineCompleted ? move.prev : currentMove
                                }
                                currentMove["next"] = tmp;
                                currentMove = tmp;
                            }
                            sideLineCompleted = false;   
                            currentToken = "";                    
                        } else {
                            if(isMove(currentToken)) {
                                currentMove["move"] = currentToken;
                                currentToken = ""
                                moves.push(currentMove);
                                currentToken = "";
                            }
                        }
                    } else {
                        if(iComment.charAt(index) == '{') {
                            let subCommentEndsOn = iComment.indexOf("}", index);
                            if(currentMove) {
                                currentMove["comment"] = iComment.substring(index+1, subCommentEndsOn);
                            } else {
                                move.comment = iComment.substring(index+1, subCommentEndsOn -1);
                            }
                            index = subCommentEndsOn;
                        } else {
                            if(iComment.charAt(index) != ")")
                                currentToken += (iComment.charAt(index) + "");
                            else {
                                if(isMove(currentToken)) {
                                    currentMove["move"] = currentToken;
                                    currentToken = ""
                                    moves.push(currentMove);
                                    currentToken = "";
                                    allSideMoves.push(moves);                                
                                    moves = []
                                    sideLineCompleted = true;
                                }
                            }    
                            if(index == (iComment.lastIndexOf(")") - 1)) {
                                if(isMove(currentToken)) {
                                    currentMove["move"] = currentToken;
                                    currentToken = ""
                                    moves.push(currentMove);
                                    currentToken = "";
                                    allSideMoves.push(moves);                                
                                }
                            }
                        }
                    }
                }
            }
        }
        return allSideMoves;
    }
    
}