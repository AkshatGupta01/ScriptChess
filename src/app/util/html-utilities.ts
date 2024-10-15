import { Renderer2 } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { Page, Post } from "../models/post";
import { metaMap } from "../static-data/meta";

export class HtmlUtilities {
    addWrapperJsScript(renderer2 : Renderer2, _document : Document, path : string) {
        const s = renderer2.createElement('script');
        s.type = 'text/javascript';
        s.src = path;
        s.text = ``;
        s.ref="dynamic"
        renderer2.appendChild(_document.body, s);
        return s;
    }

    removeWrapperJsScript(renderer2 : Renderer2, _document : Document, node : any) {
      renderer2.removeChild(_document.body, node);
    }

    addWrapperStyle(renderer2 : Renderer2, _document : Document, path : string) {
      const s = renderer2.createElement('link');
      s.href = path;
      renderer2.appendChild(_document.body, s);
    }

    addSocialMediaMetaTags(meta : Meta, post : Post | Page, url : string) {
      //facebook tags
      meta.updateTag({name:"og:title",content: post.title})
      meta.updateTag({name:"og:type",content: "article"})
      meta.updateTag({name:"og:url",content: url})
      meta.updateTag({name:"og:description",content: post.seo.metaDescription})
      if(post.image)
        meta.updateTag({name:"og:image",content: post.image.url})
      meta.updateTag({name:"og:site_name",content: "scriptchess.com"})

      //twitter tags
      meta.updateTag({name:"twitter:title",content: post.title})
      meta.updateTag({name:"twitter:card",content: "summary_large_image"})
      meta.updateTag({name:"twitter:description",content: post.seo.metaDescription})
      if(post.image)
        meta.updateTag({name:"og:image",content: post.image.url})
      
      meta.updateTag({name:"twitter:site",content: "@scriptchesscom"})
    }
    

}
