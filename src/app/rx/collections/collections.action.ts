import { Action } from '@ngrx/store'
import { GameCollection } from 'src/app/models/game-collection'

export const FETCH_GAME_COLLECTION = "FETCH_GAME_COLLECTION"
export const FETCH_GAME_COLLECTION_SUCCESS = "FETCH_GAME_COLLECTION_SUCCESS"
export const FETCH_GAME_COLLECTION_FAILED = "FETCH_GAME_COLLECTION_FAILED"

export const FETCH_GAME_COLLECTIONS = "FETCH_GAME_COLLECTIONS"
export const FETCH_GAME_COLLECTIONS_SUCCESS = "FETCH_GAME_COLLECTIONS_SUCCESS"
export const FETCH_GAME_COLLECTIONS_FAILED = "FETCH_GAME_COLLECTIONS_FAILED"

export const FETCH_GAME_COLLECTIONS_WITH_CATEGORY = "FETCH_GAME_COLLECTIONS_WITH_CATEGORY"
export const FETCH_GAME_COLLECTIONS_WITH_CATEGORY_SUCCESS = "FETCH_GAME_COLLECTIONS_WITH_CATEGORY_SUCCESS"
export const FETCH_GAME_COLLECTIONS_WITH_CATEGORY_FAILED = "FETCH_GAME_COLLECTIONS_WITH_CATEGORY_FAILED"


export const SEARCH_GAME_COLLECTIONS = "SEARCH_GAME_COLLECTIONS"
export const SEARCH_GAME_COLLECTIONS_SUCCESS = "SEARCH_GAME_COLLECTIONS_SUCCESS"
export const SEARCH_GAME_COLLECTIONS_FAILED = "SEARCH_GAME_COLLECTIONS_FAILED"

export const CREATE_GAME_COLLECTIONS = "CREATE_GAME_COLLECTIONS"
export const CREATE_GAME_COLLECTIONS_SUCCESS = "CREATE_GAME_COLLECTIONS_SUCCESS"
export const CREATE_GAME_COLLECTIONS_FAILED = "CREATE_GAME_COLLECTIONS_FAILED"


export class FetchGameCollections implements Action {
    type : string = FETCH_GAME_COLLECTIONS
    constructor(private page : number, private count : number ) {
    }
}

export class FetchGameCollectionsWithCategory implements Action {
    type : string = FETCH_GAME_COLLECTIONS_WITH_CATEGORY
    constructor(private page : number, private count : number, private category : string  ) {
    }
}

export class FetchGameCollection implements Action {
    type : string = FETCH_GAME_COLLECTION
    constructor(private collectionId : string) {
    }
}

export class SearhGameCollection implements Action {
    type : string = SEARCH_GAME_COLLECTIONS
    constructor(private name : string) {
    }
}

export class CreateGameCollection implements Action  {
    type : string = CREATE_GAME_COLLECTIONS
    constructor(private gameCollection : GameCollection) {
    }
}


