export class StockfishEval {
    material : EvalCriteria
    imbalance : EvalCriteria
    pawns : EvalCriteria
    knights : EvalCriteria
    bishops : EvalCriteria
    rooks : EvalCriteria
    queens : EvalCriteria
    mobility : EvalCriteria
    kingSafety : EvalCriteria
    threats : EvalCriteria
    passedPawns : EvalCriteria
    space : EvalCriteria
    winnable : EvalCriteria
    total : EvalCriteria
    constructor(evalText : string) {
        let lines =  evalText.split("\n");
        lines.forEach(line=> {
            if(line.indexOf("|") >-1) {
                let parts = line.split("|");
                let name = parts[1].trim();
                switch(name.toLowerCase()) {
                    case "material":
                        this.material = this.createCriteria(parts);
                        break
                    case "imbalance":
                        this.imbalance = this.createCriteria(parts);
                        break
                    case "pawns":
                        this.pawns = this.createCriteria(parts);
                        break
                    case "knights":
                        this.knights = this.createCriteria(parts);
                        break
                    case "bishops":
                        this.bishops = this.createCriteria(parts);
                        break
                    case "rooks":
                        this.rooks = this.createCriteria(parts);
                        break
                    case "queens":
                        this.queens = this.createCriteria(parts);
                        break
                    case "mobility":
                        this.mobility = this.createCriteria(parts);
                        break
                    case "king_safety":
                        this.kingSafety = this.createCriteria(parts);
                        break
                    case "threats":
                        this.threats = this.createCriteria(parts);
                        break
                    case "passed":
                        this.passedPawns = this.createCriteria(parts);
                        break
                    case "space":
                        this.space = this.createCriteria(parts);
                        break
                    case "winnable":
                        this.winnable = this.createCriteria(parts);
                        break
                    case "total":
                        this.total = this.createCriteria(parts);
                        break
                }
            }
        })
    }

    createCriteria (parts : string[]) : EvalCriteria {
        let criteria = {};
        criteria["name"] = parts[1].trim();
        let evals = parts[2].trim().split("  ").join(" ").split(" ");
        criteria["whiteMG"] = evals[0].startsWith("--") ? 0 : Number.parseFloat(evals[0]);
        criteria["whiteEG"] = evals[1].startsWith("--") ? 0 : Number.parseFloat(evals[1]);
        evals = parts[2].trim().split("  ").join(" ").split(" ");
        criteria["blackMG"] = evals[0].startsWith("--") ? 0 : Number.parseFloat(evals[0]);
        criteria["blackEG"] = evals[1].startsWith("--") ? 0 : Number.parseFloat(evals[1]);
        evals = parts[4].trim().split("  ").join(" ").split(" ");
        criteria["totalMG"] = evals[0].startsWith("--") ? 0 : Number.parseFloat(evals[0]);
        criteria["totalEG"] = evals[1].startsWith("--") ? 0 : Number.parseFloat(evals[1]);
        return criteria as EvalCriteria;
    }
}

export interface EvalCriteria {
    name? : string
    whiteMG? : number
    whiteEG? : number
    blackMG? : number
    blackEG? : number
    totalMG? : number
    totalEG? : number
}
