import { HandledRoute, httpGetJson, registerPlugin, routeSplit } from "@scullyio/scully"
export const CollectionCategory = "collectionCategory"

async function articleRoutePlugin(route: string, config : any): Promise<HandledRoute[]> {
  const {createPath} = routeSplit(route);
  //const list : any = await httpGetJson(config.url);
  const handledRoutes = [];
  if(config.list) {
    let tags : string[] = config.list;
    tags.forEach(item=>{
      handledRoutes.push({
        route: createPath(item.toLowerCase())
      });
    })
  }

  if(config.collectionId) {
    const list : any = await httpGetJson(config.collectionId.url);
    //let tags : string[] = config.list;
    list.forEach(item=>{
      let name = item.name.split(" ").join("-")
      handledRoutes.push({
        route: createPath(item.collectionId, name)
      });
    })
  }

  return Promise.resolve(handledRoutes);
}

registerPlugin('router', CollectionCategory, articleRoutePlugin);
