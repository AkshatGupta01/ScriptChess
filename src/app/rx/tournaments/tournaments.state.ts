
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Banner } from 'src/app/models/banner';
import { Tournament } from 'src/app/models/tournament';

export interface TournamentState extends EntityState<Tournament> {
    isLoading: boolean,
    error:any,
    tournaments: Tournament[],
    currentTournament? : Tournament
}

export const TournamentAdapter : EntityAdapter<Tournament> = createEntityAdapter<Tournament>({
    
})