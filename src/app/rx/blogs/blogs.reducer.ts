
import { FETCH_BANNERS, FETCH_BANNERS_FAILED, FETCH_BANNERS_SUCCESS, FETCH_PAGE, FETCH_PAGE_FAILED, FETCH_PAGE_SUCCESS, FETCH_POST, FETCH_POSTS, FETCH_POSTS_FAILED, FETCH_POSTS_SUCCESS, FETCH_POST_FAILED, FETCH_POST_SUCCESS, FETCH_WEEKLY_CHESS, FETCH_WEEKLY_CHESSES, FETCH_WEEKLY_CHESSES_FAILED, FETCH_WEEKLY_CHESSES_SUCCESS, FETCH_WEEKLY_CHESS_FAILED, FETCH_WEEKLY_CHESS_SUCCESS } from "./blogs.action";
import { PostAdapter, PostState } from "./blogs.state";

let initialState : PostState = PostAdapter.getInitialState({
    isLaoding: false,
    error: null,
    posts: []
})

export function postReducer(state : PostState = initialState, action : any) {
    let Posts = []
    switch(action["type"]) {
        case FETCH_POST:
        case FETCH_BANNERS:
        case FETCH_POSTS:
        case FETCH_PAGE:
        case FETCH_WEEKLY_CHESS:
        case FETCH_WEEKLY_CHESSES:    
            return {
                ...state,
                isLoading : true,
                error: null,
                currentPost : null,
                banners : null
            }
        case FETCH_POST_SUCCESS:
            let Post = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                currentPost : Post
            }

        case FETCH_PAGE_SUCCESS:
            let page = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                page
            }
        case FETCH_WEEKLY_CHESS_SUCCESS:
            let currentWeeklyChess = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                currentWeeklyChess
            }
        case FETCH_POSTS_SUCCESS:
            let posts = action["payload"];      
            return {
                ...state,
                isLoading : false,
                error: null,
                currentPost : null,
                posts
            }

        case FETCH_WEEKLY_CHESSES_SUCCESS:
            let weeklyChesses = action["payload"];      
            return {
                ...state,
                isLoading : false,
                error: null,
                currentPost : null,
                weeklyChesses
            }

        case FETCH_BANNERS_SUCCESS:
            let banners = action["payload"];      
            return {
                ...state,
                isLoading : false,
                error: null,
                currentPost : null,
                banners
            }

        case FETCH_POST_FAILED:
        case FETCH_BANNERS_FAILED:
        case FETCH_POSTS_FAILED:
        case FETCH_PAGE_FAILED:
        case FETCH_WEEKLY_CHESS_FAILED:
        case FETCH_WEEKLY_CHESSES_FAILED:            
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