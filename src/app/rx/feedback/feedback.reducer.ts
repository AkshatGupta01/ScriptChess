import { CLOSE_FEEDBACK_FORM, CLOSE_RATING_FORM, LAUNCH_FEEDBACK_FORM, LAUNCH_RATING_FORM } from "./feedback.action";
import { FeedbackAdapter, FeedbackState } from "./feedback.state";

let initialState : FeedbackState = FeedbackAdapter.getInitialState({
    feedbackFormLaunched : false,
    ratingFormLaunched : false
})

export function feedbackReducer(state : FeedbackState = initialState, action : any) {
    
    switch(action["type"]) {
        case LAUNCH_FEEDBACK_FORM :
            return {
                ...state,
                feedbackFormLaunched : true
            }
        case CLOSE_FEEDBACK_FORM :
            return {
                ...state,
                feedbackFormLaunched : false
            } 
        case LAUNCH_RATING_FORM :
            return {
                ...state,
                ratingFormLaunched : true
            }
        case CLOSE_RATING_FORM :
            return {
                ...state,
                ratingFormLaunched : false
            }            
        default:
            return {
                ...state
            }         
    }
}