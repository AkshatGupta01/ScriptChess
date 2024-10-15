import { environment } from "src/environments/environment"

export function getDepthForRating(rating:number) : number {    
    if(rating <= 500)
        return 2
    if(rating <= 800)
        return 3
    if(rating <= 900)        
        return 4    
    if(rating <= 1000)
        return 5
    if(rating <= 1100)
        return 6
    if(rating <= 1200)
        return 6
    if(rating <= 1300)
        return 7
    if(rating <= 1400)
        return 9
    if(rating <= 1500)
        return 10
    if(rating <= 2000)
        return 12
    if(rating <= 2300)
        return 13
    if(rating <= 2500)
        return 15
    if(rating <= 2600)
        return 16
    if(rating <= 2700)
        return 17
    if(rating <= 2800)
        return 18
    if(rating <= 2800)
        return 19
    else
        return 25;
}

export function getStockfishPath() {
    let location = window.location.href;
    let url = new URL(location);
    if(url.port == "80" || url.port == "443") {
        return url.protocol + url.hostname + environment.stockfishLocation
    }
    return  url.protocol + url.hostname + ":" + url.port +  environment.stockfishLocation

}