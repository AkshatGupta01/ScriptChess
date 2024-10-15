import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { TrainingReport } from "src/app/models/training"

export interface TrainingState extends EntityState<TrainingReport> {
  report: TrainingReport
}

export const TrainingAdapter : EntityAdapter<TrainingReport> = createEntityAdapter<TrainingReport>({

})
