
function PrintDiv(divId, name)
{
    let div = document.getElementById(divId);
    var svgElements = document.body.querySelectorAll('.piece-417db');
    svgElements.forEach(function(item) {
        item.setAttribute("width", item.getBoundingClientRect().width);
        item.setAttribute("height", item.getBoundingClientRect().height);
        item.style.width = null;
        item.style.height= null;
    });
    // html2canvas(div, {
    //     allowTaint: true, useCORS: true
    // }).then(canvas => {
    //     var myImage = canvas.toDataURL();
    //     downloadURI(myImage, name);
    // });
    html2canvas(div,{ logging: true, letterRendering: 2, allowTaint: true, useCORS: true, onclone:(A)=> {
        
    } }).then(function(canvas) {
        downloadURI(canvas.toDataURL(), name)
    });
} 
function getCanvas(divId, copyCanvasId, callback) {
    let div = document.getElementById(divId);
    var svgElements = document.body.querySelectorAll('.piece-417db');
    svgElements.forEach(function(item) {
        item.setAttribute("width", item.getBoundingClientRect().width);
        item.setAttribute("height", item.getBoundingClientRect().height);
        item.style.width = null;
        item.style.height= null;
    });
    // html2canvas(div, {
    //     allowTaint: true, useCORS: true
    // }).then(canvas => {
    //     var myImage = canvas.toDataURL();
    //     downloadURI(myImage, name);
    // });
    html2canvas(div,{ logging: true, letterRendering: 2, allowTaint: true, useCORS: true, onclone:(A)=> {
        
    } }).then(function(canvas) {
        if(copyCanvasId) {
            $("#" + copyCanvasId).appendChild(canvas);
        }
        callback(canvas);
        
    });
}

function downloadURI(uri, name) {
    var link = document.createElement("a");

    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();   
    //after creating link you should delete dynamic link
    //clearDynamicLink(link); 
}