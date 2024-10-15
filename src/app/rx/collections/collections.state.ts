
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { GameCollection } from 'src/app/models/game-collection';

export interface GameCollectionState extends EntityState<GameCollection> {
    isLoading: boolean,
    error:any,
    collections: GameCollection[],
    currentCollection? : GameCollection
}

export const GameCollectionAdapter : EntityAdapter<GameCollection> = createEntityAdapter<GameCollection>({
    
})