import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { Banner } from "src/app/models/banner";
import { Page, Post } from "src/app/models/post";
import { PostState } from "./blogs.state";

const getError = (state: PostState) => (state != null ? state.error : null)
const getPosts = (state: PostState) => (state != null ? state.posts : [])
const getCurrentPost = (state: PostState) => (state != null ? state.currentPost : null)
const getBanners = (state: PostState) => (state != null ? state.banners : [])
const getIsLoading = (state: PostState) => (state != null ? state.isLaoding : false)
const getPage = (state: PostState) => (state != null ? state.page : null)
const getWeeklyChesses = (state: PostState) => (state != null ? state.weeklyChesses : null)
const getWeeklyChess = (state: PostState) => (state != null ? state.currentWeeklyChess : null)

const selectPostState : MemoizedSelector<object, PostState> = createFeatureSelector('posts');

export const selectAllPosts : MemoizedSelector<object, Post[]> = createSelector(selectPostState, getPosts)
export const selectCurrentPost : MemoizedSelector<object, Post> = createSelector(selectPostState, getCurrentPost)
export const selectError : MemoizedSelector<object, any > = createSelector(selectPostState, getError)
export const selectBanners : MemoizedSelector<object, Banner[]> = createSelector(selectPostState, getBanners)
export const selectIsLoading : MemoizedSelector<object, boolean> = createSelector(selectPostState, getIsLoading)
export const selectPage : MemoizedSelector<object, Page> = createSelector(selectPostState, getPage)
export const selectWeeklyChesses : MemoizedSelector<object, Page[]> = createSelector(selectPostState, getWeeklyChesses)
export const selectWeeklyChess : MemoizedSelector<object, Page> = createSelector(selectPostState, getWeeklyChess)