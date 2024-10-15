
import {  FETCH_TOURNAMENT, FETCH_TOURNAMENTS, FETCH_TOURNAMENTS_FAILED, FETCH_TOURNAMENTS_SUCCESS, FETCH_TOURNAMENT_FAILED, FETCH_TOURNAMENT_SUCCESS, SEARCH_TOURNAMENTS, SEARCH_TOURNAMENTS_FAILED, SEARCH_TOURNAMENTS_SUCCESS } from "./tournaments.action";
import { TournamentAdapter, TournamentState } from "./tournaments.state";

let initialState : TournamentState = TournamentAdapter.getInitialState({
    isLoading: false,
    error: null,
    tournaments: []
})

export function tournamentReducer(state : TournamentState = initialState, action : any) {
    switch(action["type"]) {
        case FETCH_TOURNAMENT:
        case FETCH_TOURNAMENTS:
        case SEARCH_TOURNAMENTS:    
            return {
                ...state,
                isLoading : true,
                error: null,
                currentTournament : null
            }
        case FETCH_TOURNAMENT_SUCCESS:
            let tournament = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                currentTournament : tournament
            }
        case FETCH_TOURNAMENTS_SUCCESS:
        case SEARCH_TOURNAMENTS_SUCCESS:
            let tournaments = action["payload"];      
            return {
                ...state,
                isLoading : false,
                error: null,
                currentTournament : null,
                tournaments
            }

        case FETCH_TOURNAMENT_FAILED:
        case FETCH_TOURNAMENTS_FAILED:
        case SEARCH_TOURNAMENTS_FAILED:
            let error = action["error"];  
            return {
                ...state,
                isLoading : false,
                error
            } 
        default:
            return {
                ...state
            }         
    }
}