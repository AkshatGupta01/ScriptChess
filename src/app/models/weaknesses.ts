import { Square } from './../util/chesstmp';
import { Chess } from "../util/chessjs/chess"
import { ChessColors } from "./board.config"

export enum WEAKNESS {
  DOUBLED_PAWN,
  TRIPPLED_PAWN,
  ISOLATED_PAWN,
  ISOLATED_PAWN_COUPLE,
  OVERLOADED_PIECE,
  WEAK_SQUARE,
  BROKEN_PAWN_IN_FRONT_OF_KING,
  STOPPING_CASTLE,
  HANGING_PIECE,
  WEAK_PAWN,
  PINNED_PIECE,
  OVER_EXTENDED_PAWN,
  BAD_BISHOP,
  IN_CHECK,
  FORK,
  SKEWER
}

export enum STRENGTH {
  PASSED_PAWN,
  PAWN_CHAIN,
  DOUBLED_ROOK,
  LONG_RANGE_BISHOP,
  OUTPOST,
  ROOK_ON_SEVEN,
  TEMPO,
  DOUBLE_ATTACK,
  SAFE_KING,
  ACTIVE_BISHOP,
  BISHOP_PAIR
}
export interface PositionAnalysisForBothSide {
  b : PostionAnalysis[],
  w : PostionAnalysis[]
}
export interface PostionAnalysis {
  weaknesses : Weakness[]
  strength : Strenth[]
  side : ChessColors
}

export interface Weakness {
  piece? : string,
  pieces? : string[],
  square? : string,
  squares? : string[],
  weakness? : WEAKNESS
}

export interface Strenth {
  piece? : string,
  pieces? : string[],
  square? : string,
  squares? : string[],
  weakness? : STRENGTH
}


export interface PiecePosition {
  p:string[]
  r:string[]
  n:string[]
  b:string[]
  q:string[]
  k : string[]
  P:string[]
  R:string[]
  N:string[]
  B:string[]
  Q:string[]
  K:string[]
}
