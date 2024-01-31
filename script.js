const menuContainer = document.getElementById("menu-container")

let currentInputFile;
const inputImg = document.getElementById("input-img");

let divisor;
let squares;
const selectDifficulty = document.getElementById("select-difficulty");

const imgTest = document.getElementById("img-test");

const imagePreviewContainer = document.getElementById("image-preview-container");
const imagePreviewGrid = document.getElementById("image-preview-grid");
const imagePreview = document.getElementById("image-preview");

const submit = document.getElementById("submit");

const piecesGridContainer = document.getElementById("pieces-grid-container");
const puzzleGridContainer = document.getElementById("puzzle-grid-container");
let piecesGridItem = document.querySelectorAll(".pieces-grid-item");
let puzzleGridItem = document.querySelectorAll(".puzzle-grid-item");

let arrayPuzzle;
let mixedArray;

let puzzleWidth = "";
let puzzleHeight = "";
let aspectRatio = 0; 



inputImg.addEventListener("cancel",()=>{
    imagePreview.src = "";imagePreview.alt = "";
})
inputImg.addEventListener("change", (e)=>{
    const file = e.target.files[0];
    if(file === undefined){
        imagePreview.src = "";
        imagePreview.alt = "";
    }
    else{
        const imageURL = URL.createObjectURL(file)

        imagePreview.src = imageURL;
        imagePreview.alt = file.name
        imagePreviewContainer.style.display = "block"
        currentInputFile = file;
    }
    changeGrid(file)
})


selectDifficulty.addEventListener("change", ()=> changeGrid(currentInputFile))
const changeGrid = (file)=>{
    if(!file) imagePreviewContainer.style.display = "none";
    else{
        imagePreviewContainer.style.display = "block";

        divisor = selectDifficulty.value;
        squares = divisor*divisor;
    
        imagePreviewGrid.style.gridTemplateColumns = `repeat(${divisor},1fr)`;
        imagePreviewGrid.style.gridTemplateRows = `repeat(${divisor},1fr)`;
    
        imagePreviewGrid.innerHTML = "";
        const fragment = document.createDocumentFragment();
        for(let i = 0; i < squares; i++){
            const div = document.createElement("div");
            fragment.appendChild(div);
        }
        imagePreviewGrid.appendChild(fragment)

        imgTest.src = URL.createObjectURL(file)
    }
}
changeGrid()

submit.addEventListener("click",(e)=>{
    if(currentInputFile){
        e.preventDefault()
        animation(menuContainer,"disappear","none");
        animation(piecesGridContainer,"appear","grid");
        animation(puzzleGridContainer,"appear","grid");
        setUpPuzzleGrid()
    }
})


const setUpPuzzleGrid = ()=>{
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < squares; i++){
        const img = document.createElement("img");
        img.classList.add("pieces-grid-item");
        img.id = i+1;
        img.setAttribute("piece","true")

        fragment.appendChild(img)
    }
    piecesGridContainer.appendChild(fragment);


    const fragment2 = document.createDocumentFragment();
    for(let i = 0; i < squares; i++){
        const div = document.createElement("div");
        div.classList.add("puzzle-grid-item");
        div.setAttribute("draggable","true")

        const img = document.createElement("img")
        img.classList.add("img-puzzle-grid-item")
        img.src = "";

        div.appendChild(img)
        fragment2.appendChild(div)
    }
    puzzleGridContainer.appendChild(fragment2)



    setUpPuzzleImage()
}
const setUpPuzzleImage = ()=>{
    imgTest.style.display = "block";


    resizeImg(imgTest)
    const arrayImg = imgToU8CA(imgTest)

    piecesGridItem = document.querySelectorAll(".pieces-grid-item");
    puzzleGridItem = document.querySelectorAll(".puzzle-grid-item");
    arrayPuzzle = divideArrayImg(imgTest,arrayImg);
    mixedArray = mixArray(arrayPuzzle)

    for (let i = 0; i < arrayPuzzle.length; i++) {
        arrayToCanvasToURL(
            imgTest.width/divisor,
            imgTest.height/divisor,
            mixedArray[i],
            piecesGridItem[i]);
    }

    puzzleGridContainer.style.gridTemplateColumns = `repeat(${divisor},calc(${100/divisor}% - ${((divisor-1) *4) /divisor}px))`;
    puzzleGridContainer.style.gridTemplateRows =    `repeat(${divisor},calc(${100/divisor}% - ${((divisor-1) *4) /divisor}px))`;


    puzzleGridContainer.style.height = `${imgTest.height + 16 + (divisor - 1) *4}px`
    puzzleGridContainer.style.width =  `${imgTest.width + 16 + (divisor - 1) *4}px`

    puzzleHeight = puzzleGridContainer.style.height;
    puzzleWidth = puzzleGridContainer.style.width;

    puzzleHeight = puzzleHeight.substring(0,puzzleHeight.length-2);
    puzzleWidth = puzzleWidth.substring(0,puzzleWidth.length-2);
    aspectRatio = puzzleHeight/puzzleWidth;


    imgTest.style.display = "none";
    resizePuzzle()
}


const resizeImg = (img)=>{
    let currentHeight = img.height;

    const numbersArray = [
        40, 80, 120, 160, 200, 240, 280, 320, 360, 400,
        440, 480, 520, 560, 600, 640, 680, 720, 760, 800,
        840, 880, 920, 960, 1000, 1040, 1080, 1120, 1160, 1200,
        1240, 1280, 1320, 1360, 1400, 1440, 1480, 1520, 1560, 1600,
        1640, 1680, 1720, 1760, 1800, 1840, 1880, 1920, 1960, 2000,
        2040, 2080, 2120, 2160, 2200, 2240, 2280, 2320, 2360, 2400,
        2440, 2480, 2520, 2560, 2600, 2640, 2680, 2720, 2760, 2800,
        2840, 2880, 2920, 2960, 3000, 3040, 3080, 3120, 3160, 3200,
        3240, 3280, 3320, 3360, 3400, 3440, 3480, 3520, 3560, 3600,
        3640, 3680, 3720, 3760, 3800, 3840, 3880, 3920, 3960, 4000
      ];
    let numbersArray2 = [];
    numbersArray.forEach(num => numbersArray2.push(num - currentHeight))

    let closestNum = numbersArray2[0];
    numbersArray2.forEach(num =>{
        if(Math.abs(num) < Math.abs(closestNum)) closestNum = num;
    })

    img.height = closestNum + currentHeight;
}
const imgToU8CA = (img)=>{
    const imgWidth = img.width;
    const imgHeight = img.height;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = imgWidth;
    canvas.height = imgHeight;

    ctx.drawImage(img,0,0,imgWidth,imgHeight);
    const imageData = ctx.getImageData(0, 0, imgWidth,imgHeight);
    const pixelInformation = imageData.data;
    const arrayImg = new Uint8ClampedArray(pixelInformation)

    return arrayImg
}
const divideArrayImg = (img,arrayImg)=>{  
    const imgWidth = img.width;
    const imgHeight = img.height;

    const squareWidth = imgWidth / divisor;
    const squareHeight = imgHeight / divisor;

    let array = [];

    for (let i = 0; i < squares; i++) array.push([]);

    for (let y = 0; y < imgHeight; y++) {
        for (let x = 0; x < imgWidth * 4; x++) {
            const row = Math.floor(y / squareHeight);
            const col = Math.floor(x / (squareWidth * 4));

            const index = row * divisor + col;
            array[index].push(arrayImg[y * imgWidth * 4 + x]);
        }
    }
    return array
}
// const arrayToCanvas = (imgWidth,imgHeight,arrayImg,container)=>{
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
    
//     canvas.width = imgWidth;
//     canvas.height = imgHeight;

//     const imageData = ctx.createImageData(imgWidth,imgHeight);
//     imageData.data.set(arrayImg);

//     ctx.putImageData(imageData,0,0);

//     container.appendChild(canvas)
// }
const arrayToCanvasToURL = (imgWidth,imgHeight,arrayImg,img)=>{
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = imgWidth;
    canvas.height = imgHeight;

    const imageData = ctx.createImageData(imgWidth,imgHeight);
    imageData.data.set(arrayImg);

    ctx.putImageData(imageData,0,0);

    // const img = container.children[0];
    img.src = canvas.toDataURL()
}

let orderArray = []
const mixArray = (array) => {
    let mixedArray = [];
    orderArray = [];

    array.forEach((e, index) => {
        const randomIndex = Math.floor(Math.random() * mixedArray.length);

        mixedArray.splice(randomIndex, 0, e);
        orderArray.splice(randomIndex, 0, index + 1);
        

    });
    console.log("MIXED:")
    console.log(mixedArray)
    console.log("ORDER:");
    console.log(orderArray);
    return mixedArray;
};



const checkWin = ()=>{
    let orderCheck = [];
    let prueba = [];

    puzzleGridItem.forEach((e,index) => {
    
        index++

        orderCheck.push(parseInt(e.children[0].id))
    
        prueba.push(orderArray.indexOf(index) + 1)

    })

    if(orderCheck.join() === prueba.join()){

        console.log("GANASTES")

        puzzleGridContainer.setAttribute("draggable","false")
        puzzleGridItem.forEach(e =>{
            e.setAttribute("draggable","false")
            e.children[0].setAttribute("draggable","false")
        })

        animation(puzzleGridContainer,"noGap","","1s")

        puzzleGridContainer.style.gridTemplateColumns = `repeat(${divisor},calc(${100/divisor}%`;
        puzzleGridContainer.style.gridTemplateRows =    `repeat(${divisor},calc(${100/divisor}%`;

        puzzleGridItem.forEach(e => e.children[0].classList.add("puzzle-grid-item-100"))

    }
}



let canIDropIt2 = true;
let canIDropIt = false;

piecesGridContainer.addEventListener("dragstart",(e)=>{
    if(e.target.classList[0] == "pieces-grid-item"){
        e.dataTransfer.setData("text/url",e.target.src)
        e.dataTransfer.setData("text/id",e.target.id)
        e.dataTransfer.setData("text/piece",e.target.getAttribute("piece"))
    }
})
piecesGridContainer.addEventListener("drag",(e)=>{})
piecesGridContainer.addEventListener("dragend",(e)=>{
    if(canIDropIt && canIDropIt2) e.target.src = "";
})


piecesGridContainer.addEventListener("dragenter",(e)=> canIDropIt = true)
piecesGridContainer.addEventListener("dragover",(e)=>{e.preventDefault()})
piecesGridContainer.addEventListener("drop",(e)=>{

    if(e.dataTransfer.getData("text/url") == "undefined" ||
    e.dataTransfer.getData("text/url") == ""){

        console.log(11)

    }
    else{
        console.log(33)
        piecesGridItem.forEach(elem =>{
            if(elem.id == e.dataTransfer.getData("text/id")){
                elem.src = e.dataTransfer.getData("text/url")
            }
        })
        canIDropIt2 = false
    }
})
piecesGridContainer.addEventListener("dragleave",(e)=>{})


//---


puzzleGridContainer.addEventListener("dragstart",(e)=>{
    e.dataTransfer.setData("text/url",e.target.src)
    e.dataTransfer.setData("text/id",e.target.id)
})
puzzleGridContainer.addEventListener("drag",(e)=>{})
puzzleGridContainer.addEventListener("dragend",(e)=>{
    if(canIDropIt == true){
        e.target.src = "";
        e.target.id = "";
    }
})


puzzleGridContainer.addEventListener("dragenter",(e)=>{
    if(e.target.classList == "puzzle-grid-item"){
        e.target.style.backgroundColor = "#686868";
        e.target.style.outline = "1px solid #0f0"
        canIDropIt = true;
    }
    else{
        canIDropIt = false;
    }

})
puzzleGridContainer.addEventListener("dragover",(e)=>{e.preventDefault()})
puzzleGridContainer.addEventListener("drop",(e)=>{


    if(e.dataTransfer.getData("text/url") == "undefined" ||
    e.dataTransfer.getData("text/url") == ""){

        if(e.target.id !== "puzzle-grid-container"){
            e.target.style.backgroundColor = "#555";
            e.target.style.outline = "";
            console.log(1)
        }


    }
    else if(e.target.classList == "puzzle-grid-item"){

        if(e.target.children[0].id.length >= 1){
            canIDropIt = false;
        }
        else{
            e.target.children[0].src = e.dataTransfer.getData("text/url")
            e.target.children[0].id = e.dataTransfer.getData("text/id")
    
            e.target.style.backgroundColor = "#555";
            e.target.style.outline = ""
            canIDropIt2 = true;
            console.log(2)
        }


    }
    else{

        const dataURL = e.dataTransfer.getData("text/url");
        const dataId = e.dataTransfer.getData("text/id");

        const targetURL = e.target.src;
        const targetId = e.target.id;


        if(e.dataTransfer.getData("text/piece") == "true" && e.target.id !== "puzzle-grid-container"){

            piecesGridItem.forEach(elem =>{
                if(elem.id == targetId){
                    elem.src = targetURL;
                    elem.id = targetId;

                }
                else if(elem.id == dataId){
                    elem.src = "";
                }
            })

            e.target.src = dataURL;
            e.target.id = dataId;

            console.log(3.1)
        }

        else if(e.target.id !== "puzzle-grid-container"){

            puzzleGridItem.forEach(elem =>{
                if(elem.children[0].id == dataId){
                    elem.children[0].src = targetURL;
                    elem.children[0].id = targetId;
                }
            })

            e.target.src = dataURL;
            e.target.id = dataId;

            console.log(3.2)
        }

        console.log(3)

    }

    if(e.target.classList == "puzzle-grid-item"){
        e.target.style.backgroundColor = "#555";
        e.target.style.outline = ""
    }

    checkWin()


})
puzzleGridContainer.addEventListener("dragleave",(e)=>{
    if(e.target.classList == "puzzle-grid-item"){
        e.target.style.backgroundColor = "#555";
        e.target.style.outline = ""
    }
})


//---


piecesGridContainer.addEventListener("mouseover",(e)=>{
    if(e.target.classList[0] == "pieces-grid-item"){
        e.target.style.outline = "2px dashed #fff";
    }
})
piecesGridContainer.addEventListener("mouseout",(e)=>{
    if(e.target.classList[0] == "pieces-grid-item"){
        e.target.style.outline = "";
    }
})


puzzleGridContainer.addEventListener("mouseover",(e)=>{
    if(e.target.classList[0] == "puzzle-grid-item"){
        e.target.style.backgroundColor = "#686868";
    }
})
puzzleGridContainer.addEventListener("mouseout",(e)=>{
    if(e.target.classList[0] == "puzzle-grid-item"){
        e.target.style.backgroundColor = "#555";
    }
})







const animation = (element,name,display,time)=>{

    if(time !== undefined){
    element.style.animation = `${time} linear 0s 1 normal forwards running ${name}`
    }
    else{
    element.style.animation = `.3s linear 0s 1 normal forwards running ${name}`
    }

    if(display.length > 0) setTimeout(()=> element.style.display = display,300)
}

const resizePuzzle = ()=>{
    const style = getComputedStyle(piecesGridContainer)

    const height = style.getPropertyValue("height") === "auto" ? NaN 
        :parseInt(style.getPropertyValue("height")
            .substring(0,style.getPropertyValue("height").length - 2)); 

    const margin = parseInt(style.getPropertyValue("margin")
        .substring(0,style.getPropertyValue("margin").length-7)) *3;

    const newHeight = window.innerHeight - height - margin;


    if((newHeight/aspectRatio) + 23 < window.innerWidth){
        puzzleGridContainer.style.height = `${newHeight}px`;
        puzzleGridContainer.style.width = `${newHeight/aspectRatio}px`;
    }
    else{
        puzzleGridContainer.style.width = `${window.innerWidth-(innerWidth/5)}px`;
        puzzleGridContainer.style.height = `${(window.innerWidth-(innerWidth/5))*aspectRatio}px`;
    }

}
window.addEventListener("resize",resizePuzzle)