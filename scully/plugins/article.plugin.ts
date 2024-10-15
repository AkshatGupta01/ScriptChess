import { HandledRoute, httpGetJson, registerPlugin, routeSplit } from "@scullyio/scully"
export const Articles = "articles"

async function articleRoutePlugin(route: string, config : any): Promise<HandledRoute[]> {
  const {createPath} = routeSplit(route);
  const list : any = await httpGetJson(config.url);
  const handledRoutes = [];
  for (let item of list) {
    let name = item.name.split("%20").join("-");
    handledRoutes.push({
      route: createPath(name, item.id)
    });
  }
  if(config.list) {
    let tags : string[] = config.list;
    tags.forEach(item=>{
      handledRoutes.push({
        route: createPath("tags", item)
      });
    })
  }
  return Promise.resolve(handledRoutes);
}

registerPlugin('router', Articles, articleRoutePlugin);