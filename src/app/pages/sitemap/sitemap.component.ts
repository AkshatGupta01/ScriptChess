import { Component, OnInit } from '@angular/core';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { ScriptHttpServiceService } from 'src/app/services/script-http-service.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  dynamicCollectionCount = 0
  dynamicCollectionCreatedCount = 0
  staticCollectionCount = 0
  staticCollectionCreatedCount = 0
  providedSchema = ""
  sitemap = ""
  sitemapFormat= `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {sitemap}
  </urlset>
  `
  urlFormat=
  `<url>
    <loc>{loc}</loc>
    <lastmod>{date}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{prio}</priority>
  </url>
  `
  http : ScriptHttpServiceService;
  urls = []
  constructor(private service : ScriptChessServiceService) {
    this.http = service.getHttpService();
  }

  ngOnInit(): void {
  }

  startGeneration() {
    if(this.providedSchema && this.providedSchema.trim().length > 0) {
      let schema = JSON.parse(this.providedSchema);
      schema.apis.forEach(api=> {
        this.dynamicCollectionCount += api.urlConfig.length;
      })
      this.staticCollectionCount = schema.staticUrls.length;
      let today = new Date();
      let month = (today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1)
      let date =  (today.getDate()) >= 10 ? (today.getDate()) : "0" + (today.getDate())
      let todayDate = today.getFullYear() + "-"+  month+"-" + date
      //for api calls
      for(let index = 0; index < schema.apis.length; index++ ) {
        let api = schema.apis[index];
        for(let jendex=0; jendex<api.urlConfig.length; jendex++) {
          let urlConfig = api.urlConfig[jendex];

          this.http.doGet(api.apiHost + "/" + urlConfig.apiPath,[])
            .subscribe(res=> {
              if(urlConfig.isArray) {
                let body : any = res.body;
                for(let ydex=0;ydex < body.length; ydex++) {
                  let data = body[ydex];
                  let url : any = {}
                  let link = urlConfig.urlFormat;
                  urlConfig.placeholders.forEach(placeholder=> {
                    let value = data[placeholder]
                    if(placeholder.indexOf("|") > -1) {
                      let items = placeholder.split("|");
                      if(items[1] == "slug") {
                        value = data[items[0]].toLowerCase().split(" ").join("-")
                      }
                      link = link.replace("{"+items[0]+"}", value)
                    } else {
                      link = link.replace("{"+placeholder+"}", value)
                    }
                  })
                  link = link.split("'").join("")
                  link = encodeURI(link)
                  link = link.split("&").join("&amp;")
                  link = link.split("+").join("%2B")
                  link = schema.host + link

                  url.loc = link
                  url.priority = urlConfig.priority ? urlConfig.priority  : 0.5
                  url.changefreq = urlConfig.changeFreq ? urlConfig.changeFreq : "yearly"
                  url.lastMod = todayDate;
                  this.urls.push(url);
                }
                this.dynamicCollectionCreatedCount++;
                this.prepareSitemap()
              }
            },err=> {
              console.error(err)
            })

        }
      }

      //for static urls
      for(let index = 0; index < schema.staticUrls.length; index++ ) {
       let staticConfig =  schema.staticUrls[index];
       for(let jendex=0; jendex<staticConfig.routes.length; jendex++) {
        let link = schema.host + staticConfig.routes[jendex].path;
        let url : any = {}
        url.loc = link
        url.priority = staticConfig.priority ? staticConfig.priority  : 0.5
        url.changefreq = staticConfig.changeFreq ? staticConfig.changeFreq : "yearly"
        url.lastMod = todayDate;
        this.urls.push(url);
       }
       this.staticCollectionCreatedCount++
       this.prepareSitemap()
      }
    }
  }
  prepareSitemap() {
    let fullUrlStr = ""
    this.urls.forEach(url=> {
      let urlStr = this.urlFormat.replace("{loc}", url.loc).replace("{prio}", url.priority).replace("{freq}", url.changefreq).replace("{date}", url.lastMod)
      fullUrlStr += urlStr;
    })
    let localSitemap = this.sitemapFormat.replace("{sitemap}", fullUrlStr)
    this.sitemap = localSitemap;
  }

}
