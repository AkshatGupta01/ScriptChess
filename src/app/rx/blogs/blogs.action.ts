import { Action } from '@ngrx/store'

export const FETCH_POST = "FETCH_POST"
export const FETCH_POST_SUCCESS = "FETCH_POST_SUCCESS"
export const FETCH_POST_FAILED = "FETCH_POST_FAILED"

export const FETCH_POSTS = "FETCH_POSTS"
export const FETCH_POSTS_SUCCESS = "FETCH_POSTS_SUCCESS"
export const FETCH_POSTS_FAILED = "FETCH_POSTS_FAILED"

export const FETCH_BANNERS = "FETCH_BANNERS"
export const FETCH_BANNERS_SUCCESS = "FETCH_BANNERS_SUCCESS"
export const FETCH_BANNERS_FAILED = "FETCH_BANNERS_FAILED"

export const FETCH_PAGE = "FETCH_PAGE"
export const FETCH_PAGE_SUCCESS = "FETCH_PAGE_SUCCESS"
export const FETCH_PAGE_FAILED = "FETCH_PAGE_FAILED"

export const FETCH_WEEKLY_CHESSES = "FETCH_WEEKLY_CHESSES"
export const FETCH_WEEKLY_CHESSES_SUCCESS = "FETCH_WEEKLY_CHESSES_SUCCESS"
export const FETCH_WEEKLY_CHESSES_FAILED = "FETCH_WEEKLY_CHESSES_FAILED"

export const FETCH_WEEKLY_CHESS = "FETCH_WEEKLY_CHESS"
export const FETCH_WEEKLY_CHESS_SUCCESS = "FETCH_WEEKLY_CHESS_SUCCESS"
export const FETCH_WEEKLY_CHESS_FAILED = "FETCH_WEEKLY_CHESS_FAILED"

export class FetchPosts implements Action {
    type : string = FETCH_POSTS
    constructor(private offset : number, private maxCount : number) {
    }
}

export class FetchPost implements Action {
    type : string = FETCH_POST
    constructor(private postId : string) {
    }
}

export class FetchBanners implements Action {
    type : string = FETCH_BANNERS
    constructor() {}
}

export class FetchPage implements Action {
    type : string = FETCH_PAGE
    constructor(private slug : string) {}
}

export class FetchWeeklyChesses implements Action {
    type : string = FETCH_WEEKLY_CHESSES
    constructor(private offset : number, private maxCount : number) {}
}

export class FetchWeeklyChess implements Action {
    type : string = FETCH_WEEKLY_CHESS
    constructor(private slug : string) {}
}