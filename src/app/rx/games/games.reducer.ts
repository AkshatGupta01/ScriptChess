import { FETCH_GAME, FETCH_GAMES_OF_MOVES, FETCH_GAMES_OF_MOVES_FAILED, FETCH_GAMES_OF_MOVES_SUCCESS, FETCH_GAMES_OF_PLAYER, FETCH_GAMES_OF_PLAYER_FAILED, FETCH_GAMES_OF_PLAYER_SUCCESS, FETCH_GAMES_OF_TOURNAMENT, FETCH_GAMES_OF_TOURNAMENT_FAILED, FETCH_GAMES_OF_TOURNAMENT_SUCCESS, FETCH_GAME_FAILED, FETCH_GAME_SUCCESS, FETCH_MOVES, FETCH_MOVES_FAILED, FETCH_MOVES_FROM_WEEKLY_GAME, FETCH_MOVES_FROM_WEEKLY_GAME_FAILED, FETCH_MOVES_FROM_WEEKLY_GAME_SUCCESS, FETCH_MOVES_SUCCESS, FETCH_OPENINGS, FETCH_OPENINGS_FAILED, FETCH_OPENINGS_SUCCESS, FETCH_OPENING_FAILED, FETCH_OPENING_SUCCESS, SEARCH_GAMES, SEARCH_GAMES_FAILED, SEARCH_GAMES_FROM_POSITION, SEARCH_GAMES_FROM_POSITION_FAILED, SEARCH_GAMES_FROM_POSITION_SUCCESS, SEARCH_GAMES_SUCCESS, SEARCH_OPENINGS_FAILED, SEARCH_OPENINGS_SUCCESS } from "./games.action";
import { GameAdapter, GameState } from "./games.state";

let initialState : GameState = GameAdapter.getInitialState({
    isLoading: false,
    error: null,
    games: []
})

export function gameReducer(state : GameState = initialState, action : any) {
    switch(action["type"]) {
        case FETCH_GAME:
        case FETCH_GAMES_OF_PLAYER:
        case FETCH_GAMES_OF_TOURNAMENT:  
        case FETCH_GAMES_OF_MOVES:  
        case SEARCH_GAMES:
        case FETCH_OPENINGS:            
        case FETCH_MOVES: 
        case SEARCH_GAMES_FROM_POSITION:
        case FETCH_MOVES_FROM_WEEKLY_GAME:       
            return {
                ...state,
                isLoading : true,
                error: null,
                currentGame : null,
                games : null,
                ecos : null                
            }
        case FETCH_GAME_SUCCESS:
            let game = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                currentGame : game
            }

        case FETCH_MOVES_SUCCESS:
            let moves = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                moves
            }
        case FETCH_MOVES_FROM_WEEKLY_GAME_SUCCESS:
            let weeklyMoves = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                weeklyGameMoves : weeklyMoves
            }
        case FETCH_OPENINGS_SUCCESS:
            let topOpenings = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                ecosWithGame : topOpenings
            }
        case SEARCH_OPENINGS_SUCCESS:    
            let openings = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                ecos : openings
            }
        case FETCH_OPENING_SUCCESS:
            let opening = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                currentOpening : opening
            }
        case FETCH_GAMES_OF_PLAYER_SUCCESS:
        case FETCH_GAMES_OF_TOURNAMENT_SUCCESS:  
        case FETCH_GAMES_OF_MOVES_SUCCESS:  
        case SEARCH_GAMES_SUCCESS:
        case SEARCH_GAMES_FROM_POSITION_SUCCESS:    
            let games = action["payload"];      
            return {
                ...state,
                isLoading : false,
                error: null,
                currentGame : null,
                games
            }

        case FETCH_GAME_FAILED:
        case FETCH_GAMES_OF_PLAYER_FAILED:
        case FETCH_GAMES_OF_TOURNAMENT_FAILED:
        case FETCH_GAMES_OF_MOVES_FAILED:
        case FETCH_OPENINGS_FAILED:    
        case FETCH_OPENING_FAILED:
        case SEARCH_GAMES_FAILED:
        case SEARCH_GAMES_FROM_POSITION_FAILED:  
        case FETCH_OPENINGS_FAILED:  
        case SEARCH_OPENINGS_FAILED:
            let error = action["error"];  
            return {
                ...state,
                isLoading : false,
                error
            } 
        case FETCH_MOVES_FAILED: 
        let mError = action["error"];  
            return {
                ...state,
                isLoading : false,
                error : mError,
                moves : []
            } 
        case FETCH_MOVES_FROM_WEEKLY_GAME_FAILED:
            let wError = action["error"];  
            return {
                ...state,
                isLoading : false,
                error : wError,
                weeklyGameMoves : []
            }   
        default:
            return state         
    }
}