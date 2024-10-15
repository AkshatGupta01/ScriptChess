import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { FeedbackState } from "./feedback.state"


const getFeedbackFormState = (state: FeedbackState) => (state != null ? state.feedbackFormLaunched : null)
const getRatingForState = (state: FeedbackState) => (state != null ? state.ratingFormLaunched : null)

const selectFeedbackState : MemoizedSelector<object, FeedbackState> = createFeatureSelector('feedback');

export const selectFeedbackFormState : MemoizedSelector<object, boolean> = createSelector(selectFeedbackState, getFeedbackFormState)
export const selectRatingFormState : MemoizedSelector<object, boolean> = createSelector(selectFeedbackState, getRatingForState)