
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ECO, EcoModel } from 'src/app/models/eco';
import { Game } from 'src/app/models/game';

export interface GameState extends EntityState<Game> {
    isLoading: boolean,
    error:any,
    games: Game[],
    currentGame? : Game,
    ecos? : EcoModel[],
    ecosWithGame? : ECO[]
    currentOpening? : EcoModel,
    moves? : any[]
    weeklyGameMoves? : any[]    
}

export const GameAdapter : EntityAdapter<Game> = createEntityAdapter<Game>({
    
})