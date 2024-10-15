import { Action } from '@ngrx/store'

export const FETCH_STUDY = "FETCH_STUDY"
export const FETCH_STUDY_SUCCESS = "FETCH_STUDY_SUCCESS"
export const FETCH_STUDY_FAILED = "FETCH_STUDY_FAILED"

export const FETCH_STUDIES = "FETCH_STUDIES"
export const FETCH_STUDIES_SUCCESS = "FETCH_STUDIES_SUCCESS"
export const FETCH_STUDIES_FAILED = "FETCH_STUDIES_FAILED"

export class FetchStudies implements Action {
    type : string = FETCH_STUDIES
    constructor(private offset : number, private maxCount : number) {
    }
}

export class FetchStudy implements Action {
    type : string = FETCH_STUDY
    constructor(private slug : string) {
    }
}


