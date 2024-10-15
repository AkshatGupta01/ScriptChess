export interface Bot {
    name : string
    description: string
    strength : string
    elo : number
    image : string
    comments : BotComment
    designation : string,
    cheater? : boolean
}

export interface BotComment {
    opening : string
    mateSeqGiven : string
    mateSeqReceived? : string
    checkGievn? : string
    checkReceived? : string
    cheating? : string
}