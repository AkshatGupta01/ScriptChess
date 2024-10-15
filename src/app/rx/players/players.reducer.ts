
import {  FETCH_PLAYER, FETCH_PLAYERS, FETCH_PLAYERS_FAILED, FETCH_PLAYERS_SUCCESS, FETCH_PLAYER_FAILED, FETCH_PLAYER_SUCCESS, SEARCH_PLAYERS, SEARCH_PLAYERS_FAILED, SEARCH_PLAYERS_SUCCESS } from "./players.action";
import { PlayerAdapter, PlayerState } from "./players.state";

let initialState : PlayerState = PlayerAdapter.getInitialState({
    isLoading: false,
    error: null,
    players: []
})

export function playerReducer(state : PlayerState = initialState, action : any) {
    switch(action["type"]) {
        case FETCH_PLAYER:
        case FETCH_PLAYERS:
        case SEARCH_PLAYERS:
            return {
                ...state,
                isLoading : true,
                error: null,
                currentPlayer : null
            }
        case FETCH_PLAYER_SUCCESS:
            let Player = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                currentPlayer : Player
            }
        case FETCH_PLAYERS_SUCCESS:
        case SEARCH_PLAYERS_SUCCESS:
            let players = action["payload"];      
            return {
                ...state,
                isLoading : false,
                error: null,
                currentPlayer : null,
                players
            }

        case FETCH_PLAYER_FAILED:
        case FETCH_PLAYERS_FAILED:
        case SEARCH_PLAYERS_FAILED:    
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