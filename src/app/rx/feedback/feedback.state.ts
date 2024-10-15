
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Banner } from 'src/app/models/banner';
import { Feedback } from 'src/app/models/feedback';
import { Page, Post } from 'src/app/models/post';

export interface FeedbackState extends EntityState<Feedback> {
    feedbackFormLaunched : boolean
    ratingFormLaunched : boolean
}

export const FeedbackAdapter : EntityAdapter<Feedback> = createEntityAdapter<Feedback>({
    
})