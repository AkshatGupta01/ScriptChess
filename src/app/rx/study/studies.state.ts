
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Banner } from 'src/app/models/banner';
import { Study } from 'src/app/models/study';

export interface StudyState extends EntityState<Study> {
    isLaoding: boolean,
    error:any,
    studies: Study[],
    currentStudy? : Study,
    banners? : Banner[]
}

export const StudyAdapter : EntityAdapter<Study> = createEntityAdapter<Study>({
    
})