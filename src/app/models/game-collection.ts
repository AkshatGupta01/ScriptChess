export interface GameCollection {
    collectionId? : string
    name : string
    description: string
    gameIdList? : string[]
    categories : string[]
}

export enum CollectionCategory {
    OPENINGS,
    ENDGAMES,
    STRATEGY,
    POSITIONAL,
    ROMANTIC,
    WORLD_CHAMPIONSHIPS,
    PLAYER_SPECIALS,
    FAMOUS_NOVELTIES
}