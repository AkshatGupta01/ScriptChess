
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Banner } from 'src/app/models/banner';
import { Player } from 'src/app/models/player';

export interface PlayerState extends EntityState<Player> {
    isLoading: boolean,
    error:any,
    players: Player[],
    currentPlayer? : Player
}

export const PlayerAdapter : EntityAdapter<Player> = createEntityAdapter<Player>({
    
})