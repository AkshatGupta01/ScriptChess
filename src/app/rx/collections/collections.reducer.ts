
import {  CREATE_GAME_COLLECTIONS, CREATE_GAME_COLLECTIONS_FAILED, CREATE_GAME_COLLECTIONS_SUCCESS, FETCH_GAME_COLLECTION, FETCH_GAME_COLLECTIONS, FETCH_GAME_COLLECTIONS_FAILED, FETCH_GAME_COLLECTIONS_SUCCESS, FETCH_GAME_COLLECTIONS_WITH_CATEGORY, FETCH_GAME_COLLECTIONS_WITH_CATEGORY_FAILED, FETCH_GAME_COLLECTIONS_WITH_CATEGORY_SUCCESS, FETCH_GAME_COLLECTION_FAILED, FETCH_GAME_COLLECTION_SUCCESS, SEARCH_GAME_COLLECTIONS, SEARCH_GAME_COLLECTIONS_FAILED, SEARCH_GAME_COLLECTIONS_SUCCESS } from "./collections.action";
import { GameCollectionAdapter, GameCollectionState } from "./collections.state";


let initialState : GameCollectionState = GameCollectionAdapter.getInitialState({
    isLoading: false,
    error: null,
    collections: []
})

export function gameCollectionReducer(state : GameCollectionState = initialState, action : any) {
    switch(action["type"]) {
        case FETCH_GAME_COLLECTION:
        case FETCH_GAME_COLLECTIONS:
        case SEARCH_GAME_COLLECTIONS:
        case CREATE_GAME_COLLECTIONS:     
        case FETCH_GAME_COLLECTIONS_WITH_CATEGORY:       
            return {
                ...state,
                isLoading : true,
                error: null,
                collections : null
            }
        case FETCH_GAME_COLLECTION_SUCCESS:
            let gameCollection = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                currentCollection : gameCollection
            }
        case FETCH_GAME_COLLECTIONS_SUCCESS:
        case SEARCH_GAME_COLLECTIONS_SUCCESS:   
        case FETCH_GAME_COLLECTIONS_WITH_CATEGORY_SUCCESS:     
            let collections = action["payload"];      
            return {
                ...state,
                isLoading : false,
                error: null,
                currentCollection : null,
                collections
            }
        case CREATE_GAME_COLLECTIONS_SUCCESS:
            let currentCollection = action["payload"];      
            return {
                ...state,
                isLoading : false,
                error: null,
                currentCollection
            }
        case FETCH_GAME_COLLECTION_FAILED:
        case FETCH_GAME_COLLECTIONS_FAILED:
        case SEARCH_GAME_COLLECTIONS_FAILED:   
        case CREATE_GAME_COLLECTIONS_FAILED: 
        case FETCH_GAME_COLLECTIONS_WITH_CATEGORY_FAILED:
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