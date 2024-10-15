
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Banner } from 'src/app/models/banner';
import { Page, Post } from 'src/app/models/post';

export interface PostState extends EntityState<Post> {
    isLaoding: boolean,
    error:any,
    posts?: Post[],
    page?: Page,
    currentPost? : Post,
    banners? : Banner[],
    weeklyChesses? : Page[],
    currentWeeklyChess? : Page
}

export const PostAdapter : EntityAdapter<Post> = createEntityAdapter<Post>({
    
})