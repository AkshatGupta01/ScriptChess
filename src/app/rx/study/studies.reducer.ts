
import { FETCH_STUDY, FETCH_STUDIES, FETCH_STUDIES_FAILED, FETCH_STUDIES_SUCCESS, FETCH_STUDY_FAILED, FETCH_STUDY_SUCCESS } from "./studies.action";
import { StudyAdapter, StudyState } from "./studies.state";

let initialState : StudyState = StudyAdapter.getInitialState({
    isLaoding: false,
    error: null,
    studies: []
})

export function studyReducer(state : StudyState = initialState, action : any) {
    let Studys = []
    switch(action["type"]) {
        case FETCH_STUDY:
        case FETCH_STUDIES:
            return {
                ...state,
                isLoading : true,
                error: null,
                currentStudy : null
            }
        case FETCH_STUDY_SUCCESS:
            let Study = action["payload"];    
            return {
                ...state,
                isLoading : false,
                error: null,
                currentStudy : Study
            }
        case FETCH_STUDIES_SUCCESS:
            let studies = action["payload"];      
            return {
                ...state,
                isLoading : false,
                error: null,
                currentStudy : null,
                studies
            }


        case FETCH_STUDY_FAILED:
        case FETCH_STUDIES_FAILED:
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