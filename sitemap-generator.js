const { Placeholder } = require('@angular/compiler/src/i18n/i18n_ast')
const axios = require('axios')
let schema = {
  host:"https://scriptchess.com/",
  apis : [
    {
      apiHost : "https://api.scriptchess.com",
      urlConfig : [
        {
          apiPath:"tournaments",
          item : "tournaments",
          urlFormat: "search/tournaments/{id}/{name}/{year}",
          isArray : true,
          placeholders:["id","name", "year"]
        },
        {
          apiPath:"collections",
          item : "tournaments",
          urlFormat: "search/collections/{id}/{name}",
          isArray : true,
          placeholders:["id","name|slug"]
        }
      ]
    },
    {
      apiHost : "https://blog.scriptchess.com",
      urlConfig : [
        {
          apiPath:"/articles?_limit=100&_sort=published_at:desc&_start=0",
          item : "articles",
          urlFormat: "articles/{slug}",
          isArray : true,
          placeholders:["slug"]
        }
      ]
    }
  ],
  staticUrls: [
    {
      priority : "1.0",
      lastMod: "latest",
      changeFreq: "weekly",
      routes: [
        {
          path:'tools/free-chess-explorer'
        },
        {
            path:'tools/free-chess-engine'
        },
        {
            path:'tools/fen-visualizer'
        },
        {
            path:'tools/download-games'
        },
        {
            path:'tools/play-against-chess-bots'
        },
        {
            path:'tools/openings'
        },
        {
            path:'tools/pgn-player'
        },
        {
            path:'tools/novelty-finder'
        },
        {
            path:'tools/chess-puzzles'
        },
        {
          path:'tools/study'
        },
        {
          path:'tools/puzzle-sets'
        },
        {
            path:'tools/position-quiz'
        },
        {
            path:'tools/endgame-trainer'
        },
        {
            path:'tools/multiple-chess-games-analyzer'
        }
      ]
    },
    {
      priority : "1.0",
      lastMod: "latest",
      changeFreq: "weekly",
      routes : [
        {
          title : "Players",
          imagePath : "/assets/images/player.png",
          path:"/players"
        },
        {
            title : "Tournaments",
            imagePath : "/assets/images/trophy.png",
            path:"/tournaments"
        },
        {
          title : "How To Play Chess",
          imagePath : "/assets/images/how-to.png",
          path:"/pages/how-to-play-chess"
        },
        {
            title : "Understanding chess notations",
            imagePath : "/assets/images/notations.png",
            path:"/pages/understanding-chess-notations-a-complete-biginner-s-guide"
        },
        {
            title : "Know chess Jargons",
            imagePath : "/assets/images/jargons.png",
            path:"/pages/know-chess-jargons"
        },
        {
            title : "How To Use Script chess",
            imagePath : "/assets/images/guide.png",
            path:"/pages/how-to-use-scriptchess"
        },
        {
            title : "Play Against Epic Chess bots",
            imagePath : "/assets/images/bot.png",
            path:"/play-against-chess-bots"
        },
        {
            title : "How to start chess career",
            imagePath : "/assets/images/professional.png",
            path:"/pages/how-to-start-a-professional-chess-career"
        },
        {
          title : "How to start chess career",
          imagePath : "/assets/images/professional.png",
          path:"/search/collections/romantic"
        },
        {
          title : "How to start chess career",
          imagePath : "/assets/images/professional.png",
          path:"/search/collections/endgames"
        },
        {
          title : "How to start chess career",
          imagePath : "/assets/images/professional.png",
          path:"/search/collections/openings"
        },
        {
          title : "How to start chess career",
          imagePath : "/assets/images/professional.png",
          path:"/search/collections/player_specials"
        }
      ]
    },
    {
      priority : "0.5",
      lastMod: "latest",
      changeFreq: "monthly",
      routes : [
        {
          path:"/pages/about-scripchess"
        },
        {
          path:"/pages/contact-us"
        }
      ]
    }
    ,
    {
      priority : "1.0",
      lastMod: "latest",
      changeFreq: "daily",
      routes : [
        {
          path:"/"
        }
      ]
    }
  ]
}
let urls = []
let apisCompleted = false
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
function generateSitemap() {

}

generateSitemap()
