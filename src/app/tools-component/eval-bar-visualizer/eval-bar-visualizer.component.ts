import { Component, Input, OnInit } from '@angular/core';
import { StockfishEval } from 'src/app/models/eval';

const OFFSET = 50
@Component({
  selector: 'app-eval-bar-visualizer',
  templateUrl: './eval-bar-visualizer.component.html',
  styleUrls: ['./eval-bar-visualizer.component.scss']
})
export class EvalBarVisualizerComponent implements OnInit {

  @Input()
  stockfishEval : StockfishEval

  @Input()
  phase : number

  material : number
  imbalance : number
  pawns : number
  knights : number
  bishops : number
  rooks : number
  queens : number
  mobility : number
  threats : number
  passedPawns : number
  space : number  
  total : number

  constructor() { }

  ngOnInit(): void {
    this.setValues()
  }

  ngOnChanges() {
    this.setValues()
  }

  setValues() {
    if(this.phase == 1) {
      //this is endgame
      this.material = OFFSET + this.stockfishEval.material.totalEG;
      this.imbalance = OFFSET + this.stockfishEval.imbalance.totalEG;
      this.pawns = OFFSET + this.stockfishEval.pawns.totalEG;
      this.bishops = OFFSET + this.stockfishEval.bishops.totalEG;
      this.knights = OFFSET + this.stockfishEval.knights.totalEG;
      this.rooks = OFFSET + this.stockfishEval.rooks.totalEG;
      this.queens = OFFSET + this.stockfishEval.queens.totalEG;
      this.threats = OFFSET + this.stockfishEval.threats.totalEG;
      this.mobility = OFFSET + this.stockfishEval.mobility.totalEG;
      this.space = OFFSET + this.stockfishEval.space.totalEG;
      this.passedPawns = OFFSET + this.stockfishEval.passedPawns.totalEG;
      this.total = OFFSET + this.stockfishEval.total.totalEG;
    } else {
      this.material = OFFSET + this.stockfishEval.material.totalMG;
      this.imbalance = OFFSET + this.stockfishEval.imbalance.totalMG;
      this.pawns = OFFSET + this.stockfishEval.pawns.totalMG;
      this.bishops = OFFSET + this.stockfishEval.bishops.totalMG;
      this.knights = OFFSET + this.stockfishEval.knights.totalMG;
      this.rooks = OFFSET + this.stockfishEval.rooks.totalMG;
      this.queens = OFFSET + this.stockfishEval.queens.totalMG;
      this.threats = OFFSET + this.stockfishEval.threats.totalMG;
      this.mobility = OFFSET + this.stockfishEval.mobility.totalMG;
      this.space = OFFSET + this.stockfishEval.space.totalMG;
      this.passedPawns = OFFSET + this.stockfishEval.passedPawns.totalMG;
      this.total = OFFSET + this.stockfishEval.total.totalMG;
    }
  }

}
