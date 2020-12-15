function ImgTag(event){
    var Img =  document.createElement("img") 
    var imageDiv = document.getElementById('output');
    Img.src = URL.createObjectURL(event.target.files[0]);
    Img.height = "300px";
    imageDiv.appendChild(Img)
}

var loadFile = function (event) { 
    ImgTag(event);
};