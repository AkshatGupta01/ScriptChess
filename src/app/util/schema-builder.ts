import { Meta } from "@angular/platform-browser"
import { Page, Post } from "../models/post"
import { SlugifyPipe } from "../pipes/slugify.pipe"

const schemaFormatForBlogWithFaq = "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"Organization\",\"@id\":\"https://scriptchess.com/#organization\",\"name\":\"Script Chess\",\"url\":\"https://scriptchess.com\",\"email\":\"scriptchesscom@gmail.com\",\"logo\":{\"@type\":\"ImageObject\",\"@id\":\"https://scriptchess.com/#logo\",\"url\":\"https://scriptchess.com/assets/images/scriptchess-logo.png\",\"caption\":\"Script Chess\",\"inLanguage\":\"en-US\",\"width\":\"153\",\"height\":\"33\"}},{\"@type\":\"WebSite\",\"@id\":\"https://scriptchess.com/#website\",\"url\":\"https://scriptchess.com\",\"name\":\"Script Chess\",\"publisher\":{\"@id\":\"https://scriptchess.com/#organization\"},\"inLanguage\":\"en-US\"},{\"@type\":\"ImageObject\",\"@id\":\"{{primaryImageUrlId}}\",\"url\":\"{{primaryImageUrl}}\",\"width\":\"{{primaryImageWidth}}\",\"height\":\"{{primaryImageHeight}}\",\"caption\":\"{{title}}\",\"inLanguage\":\"en-US\"},{{breadCrumbList}},{\"@type\":\"Person\",\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#author\",\"name\":\"{{authorName}}\",\"image\":{\"@type\":\"ImageObject\",\"@id\":\"{{authorImageId}}\",\"url\":\"{{authorImage}}\",\"caption\":\"{{authorName}}\",\"inLanguage\":\"en-US\"},\"worksFor\":{\"@id\":\"https://scriptchess.com/#organization\"}},{\"@type\":\"WebPage\",\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#webpage\",\"url\":\"https://scriptchess.com/blogs/{{slug}}/\",\"name\":\"BestDumbbellsForHomeGym|2021-Bestpull\",\"datePublished\":\"{{blogPublishDate}}\",\"dateModified\":\"{{blogModifiedDate}}\",\"author\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#author\"},\"isPartOf\":{\"@id\":\"https://scriptchess.com/#website\"},\"primaryImageOfPage\":{\"@id\":\"{{primaryImageUrl}}\"},\"inLanguage\":\"en-US\",\"breadcrumb\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#breadcrumb\"}},{\"@type\":\"BlogPosting\",\"headline\":\"{{title}}\",\"keywords\":\"{{keywords}}\",\"datePublished\":\"{{blogPublishDate}}\",\"dateModified\":\"{{blogModifiedDate}}\",\"author\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#author\"},\"publisher\":{\"@id\":\"https://scriptchess.com/#organization\"},\"description\":\"{{description}}\",\"name\":\"{{title}}\",\"subjectOf\":[{\"@type\":\"FAQPage\",\"mainEntity\":[{{faqSchema}}]}],\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#richSnippet\",\"isPartOf\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#webpage\"},\"image\":{\"@id\":\"{{primaryImageUrl}}\"},\"inLanguage\":\"en-US\",\"mainEntityOfPage\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#webpage\"}}]}"
const schemaFormatForBlog = "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"Organization\",\"@id\":\"https://scriptchess.com/#organization\",\"name\":\"Script Chess\",\"url\":\"https://scriptchess.com\",\"email\":\"scriptchesscom@gmail.com\",\"logo\":{\"@type\":\"ImageObject\",\"@id\":\"https://scriptchess.com/#logo\",\"url\":\"https://scriptchess.com/assets/images/scriptchess-logo.png\",\"caption\":\"Script Chess\",\"inLanguage\":\"en-US\",\"width\":\"153\",\"height\":\"33\"}},{\"@type\":\"WebSite\",\"@id\":\"https://scriptchess.com/#website\",\"url\":\"https://scriptchess.com\",\"name\":\"Script Chess\",\"publisher\":{\"@id\":\"https://scriptchess.com/#organization\"},\"inLanguage\":\"en-US\"},{\"@type\":\"ImageObject\",\"@id\":\"{{primaryImageUrlId}}\",\"url\":\"{{primaryImageUrl}}\",\"width\":\"{{primaryImageWidth}}\",\"height\":\"{{primaryImageHeight}}\",\"caption\":\"{{title}}\",\"inLanguage\":\"en-US\"},{{breadCrumbList}},{\"@type\":\"Person\",\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#author\",\"name\":\"{{authorName}}\",\"image\":{\"@type\":\"ImageObject\",\"@id\":\"{{authorImageId}}\",\"url\":\"{{authorImage}}\",\"caption\":\"{{authorName}}\",\"inLanguage\":\"en-US\"},\"worksFor\":{\"@id\":\"https://scriptchess.com/#organization\"}},{\"@type\":\"WebPage\",\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#webpage\",\"url\":\"https://scriptchess.com/blogs/{{slug}}/\",\"name\":\"BestDumbbellsForHomeGym|2021-Bestpull\",\"datePublished\":\"{{blogPublishDate}}\",\"dateModified\":\"{{blogModifiedDate}}\",\"author\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#author\"},\"isPartOf\":{\"@id\":\"https://scriptchess.com/#website\"},\"primaryImageOfPage\":{\"@id\":\"{{primaryImageUrl}}\"},\"inLanguage\":\"en-US\",\"breadcrumb\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#breadcrumb\"}},{\"@type\":\"BlogPosting\",\"headline\":\"{{title}}\",\"keywords\":\"{{keywords}}\",\"datePublished\":\"{{blogPublishDate}}\",\"dateModified\":\"{{blogModifiedDate}}\",\"author\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#author\"},\"publisher\":{\"@id\":\"https://scriptchess.com/#organization\"},\"description\":\"{{description}}\",\"name\":\"{{title}}\",\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#richSnippet\",\"isPartOf\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#webpage\"},\"image\":{\"@id\":\"{{primaryImageUrl}}\"},\"inLanguage\":\"en-US\",\"mainEntityOfPage\":{\"@id\":\"https://scriptchess.com/blogs/{{slug}}/#webpage\"}}]}"
const schemaFormatForFAQ = "{\"@type\":\"Question\",\"url\":\"https://scriptchess.com/blogs/{{slug}}/#{{faqId}}\",\"name\":\"{{question}}\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"{{answer}}\"}}"
const schemaForBreadSrumb = "{ \"@type\": \"BreadcrumbList\", \"@id\": \"https://scriptchess.com/blogs/{{slug}}/#breadcrumb\", \"itemListElement\": [ { \"@type\": \"ListItem\", \"position\": \"1\", \"item\": { \"@id\": \"https://scriptchess.com\", \"name\": \"Home\" } }, { \"@type\": \"ListItem\", \"position\": \"2\", \"item\": { \"@id\": \"https://scriptchess.com/blogs/{{slug}}/{{slug}}/\", \"name\": \"{{title}}\" } } ] }"
export function buildSchemaForBlog(article : Post) {
    let keywords = "";
    let faqSchema = "";
    let fullSchema = "";
    let faqIdTemplate = "#faq-question-"
    let breadCrumbSchema = "";
    if(article.tags && article.tags.length > 0) {
        article.tags.forEach(item=>{
            keywords = keywords + handleQuotes(item.name)+",";
        })
        if(keywords.endsWith(",")) {
            keywords = keywords.substr(0, keywords.length - 1);
        }
    }
    if(article.faq && article.faq.length > 0) {
        article.faq.forEach(item=> {
            let faqItem = schemaFormatForFAQ.split("{{slug}}").join(handleQuotes(article.slug));
            let faqId = faqIdTemplate + item.id;
            faqItem = faqItem.replace("{{faqId}}", faqId);
            faqItem = faqItem.replace("{{question}}", handleQuotes(item.question));
            faqItem = faqItem.replace("{{answer}}", handleQuotes(item.answer));
            faqSchema = faqSchema + faqItem + ",";
        })
        if(faqSchema.endsWith(",")) {
            faqSchema = faqSchema.substr(0, faqSchema.length - 1);
        }
        
    }
    breadCrumbSchema = schemaForBreadSrumb.split("{{slug}}").join(article.slug);
    breadCrumbSchema = breadCrumbSchema.split("{{title}}").join(article.title);
    //breadcrumbListSchema = breadcrumbListSchema.replace("{{breadCrumbList}}")
    if(article.image.formats.medium) {
        if(article.faq != null && article.faq.length > 0)
            fullSchema = schemaFormatForBlogWithFaq.split("{{primaryImageUrlId}}").join(article.image.formats.medium.url);
        else    
        fullSchema = schemaFormatForBlog.split("{{primaryImageUrlId}}").join(article.image.formats.medium.url);
        fullSchema = fullSchema.split("{{primaryImageUrl}}").join(article.image.formats.medium.url);
        fullSchema = fullSchema.split("{{primaryImageWidth}}").join(article.image.formats.medium.width+"");
        fullSchema = fullSchema.split("{{primaryImageHeight}}").join(article.image.formats.medium.height+"");
    } else {
        if(article.image.formats.small) {
            fullSchema = schemaFormatForBlogWithFaq.split("{{primaryImageUrlId}}").join(article.image.formats.small.url);
            fullSchema = fullSchema.split("{{primaryImageUrl}}").join(article.image.formats.small.url);
            fullSchema = fullSchema.split("{{primaryImageWidth}}").join(article.image.formats.small.width+"");
            fullSchema = fullSchema.split("{{primaryImageHeight}}").join(article.image.formats.small.height+"");
        } else {
            if(article.image.formats.thumbnail) {
                fullSchema = schemaFormatForBlogWithFaq.split("{{primaryImageUrlId}}").join(article.image.formats.thumbnail.url);
                fullSchema = fullSchema.split("{{primaryImageUrl}}").join(article.image.formats.thumbnail.url);
                fullSchema = fullSchema.split("{{primaryImageWidth}}").join(article.image.formats.thumbnail.width+"");
                fullSchema = fullSchema.split("{{primaryImageHeight}}").join(article.image.formats.thumbnail.height+"");
            }   
        }   
    }
    fullSchema = fullSchema.split("{{title}}").join(handleQuotes(article.title));
    fullSchema = fullSchema.split("{{authorName}}").join(handleQuotes(article.author.name));
    fullSchema = fullSchema.split("{{authorImageId}}").join(article.author.picture.formats.thumbnail.url);
    fullSchema = fullSchema.split("{{authorImage}}").join(article.author.picture.formats.thumbnail.url);
    fullSchema = fullSchema.split("{{slug}}").join(article.slug);
    fullSchema = fullSchema.split("{{blogPublishDate}}").join(article.published_at);
    fullSchema = fullSchema.split("{{blogModifiedDate}}").join(article.updated_at);
    fullSchema = fullSchema.split("{{keywords}}").join(keywords);
    fullSchema = fullSchema.split("{{description}}").join(article.description);
    fullSchema = fullSchema.split("{{faqSchema}}").join(faqSchema);
    fullSchema = fullSchema.split("{{breadCrumbList}}").join(breadCrumbSchema);
    return fullSchema;
}

function handleQuotes(value : string) {
    return value.split("\"").join("\\\"");
    //return value;
}

export function buildHeadingTable(html : string, path : string) {
    
    let domParser = new DOMParser();
    let document = domParser.parseFromString(html, "text/html");    
    let h3Tags = document.getElementsByTagName("h3")
    let tableMarkup = "<div class='navigation-table'><h2>Navigation Table </h2><ul>{1}</ul></div>"
    let listMarkup = "<li><a pageScroll href='"+path+"#{1}' target='_self'>{2}</a></li>"
    let listHtml = "";
    let slugyFi = new SlugifyPipe();
    for(let i=0;i < h3Tags.length; i++) {
      let element = h3Tags.item(i);
      if(!element.innerHTML || element.innerHTML.trim().length == 0 || element.innerHTML.trim() == '&nbsp;')
        continue;
      let slug = slugyFi.transform(element.innerHTML);
      element.setAttribute("id", slug);
      listHtml = listHtml + "\n" + listMarkup.replace("{1}", slug).replace("{2}", element.innerHTML);
    }
    if(listHtml && listHtml.trim().length > 0) {
        tableMarkup = tableMarkup.replace("{1}", listHtml);    
        let body = document.body.innerHTML;
        body = tableMarkup + body;
        return body;
    }        
    return html;
}

export  function addSocialMediaMetaTags(meta : Meta, post : Post | Page, document) {
    let url = "https://scriptchess.com" + document.location.pathname
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