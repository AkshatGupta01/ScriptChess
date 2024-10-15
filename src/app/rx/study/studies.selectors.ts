import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { Banner } from "src/app/models/banner";
import { Study } from "src/app/models/study";
import { StudyState } from "./studies.state";

const getError = (state: StudyState) => (state != null ? state.error : null)
const getStudys = (state: StudyState) => (state != null ? state.studies : [])
const getCurrentStudy = (state: StudyState) => (state != null ? state.currentStudy : null)
const getBanners = (state: StudyState) => (state != null ? state.banners : [])
const getIsLoading = (state: StudyState) => (state != null ? state.isLaoding : false)

const selectStudyState : MemoizedSelector<object, StudyState> = createFeatureSelector('studies');

export const selectAllStudys : MemoizedSelector<object, Study[]> = createSelector(selectStudyState, getStudys)
export const selectCurrentStudy : MemoizedSelector<object, Study> = createSelector(selectStudyState, getCurrentStudy)
export const selectError : MemoizedSelector<object, any > = createSelector(selectStudyState, getError)
export const selectBanners : MemoizedSelector<object, Banner[]> = createSelector(selectStudyState, getBanners)
export const selectIsLoading : MemoizedSelector<object, boolean> = createSelector(selectStudyState, getIsLoading)