import { Action } from '@ngrx/store'

export const LAUNCH_FEEDBACK_FORM = "LAUNCH_FEEDBACK_FORM"
export const CLOSE_FEEDBACK_FORM = "CLOSE_FEEDBACK_FORM"
export const LAUNCH_RATING_FORM = "LAUNCH_RATING_FORM"
export const CLOSE_RATING_FORM = "CLOSE_RATING_FORM"

export class LaunchFeedbackForm implements Action {
    type : string = LAUNCH_FEEDBACK_FORM
    constructor() {}
}

export class CloseFeedbackForm implements Action {
    type : string = CLOSE_FEEDBACK_FORM
    constructor() {}
}

export class LaunchRatingForm implements Action {
    type : string = LAUNCH_RATING_FORM
    constructor() {}
}

export class CloseRatingForm implements Action {
    type : string = CLOSE_RATING_FORM
    constructor() {}
}