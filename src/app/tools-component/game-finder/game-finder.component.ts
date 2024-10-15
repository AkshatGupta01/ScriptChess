import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/models/player';
import { Tournament } from 'src/app/models/tournament';
import { players } from 'src/app/static-data/players';
import { tournaments } from 'src/app/static-data/tournament';

@Component({
  selector: 'app-game-finder',
  templateUrl: './game-finder.component.html',
  styleUrls: ['./game-finder.component.scss']
})
export class GameFinderComponent implements OnInit {

  gamesModeClass = "active"
  movesModeClass = ""
  currentMode = "games";

  availablePlayers : Player[] = players
  availableTournaments : Tournament[] = tournaments

  @Output()
  onSelectPlayer = new EventEmitter<Player>();

  @Output()
  onSelectTournament = new EventEmitter<Tournament>();

  constructor() { }

  ngOnInit(): void {
  }

  setMode(mode : string) {
    this.currentMode = mode;
    if(this.currentMode == "games") {
      this.gamesModeClass = "active"
      this.movesModeClass = ""
    } else {
      this.gamesModeClass = ""
      this.movesModeClass = "active"
    }
  }

  selecetedPlayer(player : Player) {
    this.onSelectPlayer.emit(player)
  }

  selecetedTournament(tournament : Tournament) {
    this.onSelectTournament.emit(tournament)
  }
}
