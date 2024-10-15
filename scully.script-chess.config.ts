import { ScullyConfig } from '@scullyio/scully';
/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer'
import { CollectionCategory } from './scully/plugins/collection-categegory.plugin';

export const config: ScullyConfig = {
  projectRoot: "./src",
  projectName: "script-chess",
  // add spsModulePath when using de Scully Platform Server,
  outDir: './dist/static',
  routes: {
    "/articles/:slug": {
      type : "json",
      "slug":{
        url:"https://blog.scriptchess.com/articles",
        property:"slug"
      }
    },
    "/articles/collections/:category":{
      type : CollectionCategory,
      list: [
        "OPENINGS",
        "ENDGAMES",
        "STRATEGY",
        "POSITIONAL",
        "ROMANTIC",
        "WORLD_CHAMPIONSHIPS",
        "PLAYER_SPECIALS",
        "FAMOUS_NOVELTIES"
      ]
    },
    "/articles/collections/:collectionId/:collectionName":{
      type : CollectionCategory,
      "collectionId":{
        url:"https://api.scriptchess.com/collections",
        property:"collectionId"
      },
      "collectionName":{
        url:"https://api.scriptchess.com/collections",
        property:"name"
      }
    }
  }
};