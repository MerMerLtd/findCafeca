// header slide-image
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
}

//----------------------------------------------------------
// slide in puzzle card on scroll

//window.scrollY        // 取的瀏覽器視窗捲軸 Y 的高度（捲軸在最上方時是 0）
//window.innerHeight    // 瀏覽器內視窗的高度
//element.offsetTop     // 元素距離外層容器(父層元素)上方的距離
//element.height        // 元素的高度

// STEP1 選擇所有卡片盒子
const cardHolders = document.querySelectorAll(".card__holder");

// 選擇滑動提示
const hint = document.querySelector(".card__slide-hint");

// STEP2 監聽 window 捲動滾動事件
window.addEventListener("scroll", debounce(scrollHandler));

//STEP3 處理捲軸滾動
function scrollHandler (){
    cardHolders.forEach(cardHolder =>{
        //卡片盒子位置Y 
        const cardHolderY = cardHolder.offsetParent.offsetTop + cardHolder.offsetTop ;
        //將瀏覽器視窗底部位置減掉卡片盒子一半高度作為觸發點
        const slideInAt = window.scrollY + window.innerHeight - cardHolder.offsetHeight/2; 
        // 卡片盒子底部位置
        // const cardHolderBottom = cardHolderY + cardHolder.offsetHeight;
        //當瀏覽器底部跑到卡片盒子一半位置下方時
        // const isHalfShown = slideInAt > cardHolderY - cardHolder.offsetHeight/2 ;//animation2
        const isHalfShown = slideInAt > cardHolderY - cardHolder.offsetHeight;//animation1, animation3
        // 瀏覽器底部還沒通過卡片盒子底部時
        const isNotScrolledPast = window.scrollY < cardHolderY + cardHolder.offsetHeight/4;//animation2
        // const isNotScrolledPast = window.scrollY < cardHolderY- cardHolder.offsetHeight/2;//animation1, animation3
        // 若瀏覽器底部超過卡片盒子的一半
        // 且未通過卡片盒子底部
        // 就讓卡片盒子現身
        // 反之隱藏
        if (isHalfShown && isNotScrolledPast) {
            cardHolder.classList.add('active');
            hint.classList.add('show');
        } else {
            cardHolder.classList.remove('active');
            hint.classList.remove('show');
        }
    }); 
}

// debounce 函式
// 另外，因為我們監聽的是 window 上的 scroll 事件，所以只要瀏覽器一有 scroll 的情況都會觸發這個事件，這可能導致瀏覽器的效能下降，因此在這堂範例中額外提供 debounce 函式，這個函式的功能是在「特定的時間內，只會觸發某事件一次」。

// 這種 debounce 函式常常應用在可能會多次觸發事件的時間點，例如 scroll, keydown 等等。在 lodash.js 中亦可找到此函式。
function debounce(func, wait = 20, immediate = true) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

//----------------------------------------------------------
// moving hint
cardHolders.forEach(card => card.addEventListener("mouseover",() => hint.classList.remove('show')));
cardHolders.forEach(card => card.addEventListener("mouseout",() => hint.classList.add('show')));

//----------------------------------------------------------
// moving puzzle card

//STEP1 監聽卡片上的滑動
cardHolders.forEach(card => card.addEventListener("touchmove",(event) =>{

}));

//-------------------------------------------------------------
//移動裝置滑動屏幕方向判斷
//https://www.itread01.com/content/1531751882.html
//The atan2() method returns the arctangent of the quotient of its arguments, as a numeric value between PI and -PI radians.(by w3s)

//返回角度
getSlideAngle = (dx, dy) => Math.atan2(dy, dx)*180/Math.PI;//With atan2(), the y coordinate is passed as the first argument and the x coordinate is passed as the second argument.

//根據起點和終點返回方向判斷1:上，2:左，3:下，4:右，0:未滑動
getSlideDirection = (startX, startY, endX, endY) => {
    let dy = startY - endY;//標準座標系與屏幕座標系的Y軸方向相反
    let dx = endX - startX;
    let result = 0;

    //如果滑動距離太短
    if(Math.abs(dx)<2 && Math.abs(dy)<2){
        return result;
    }

    let angle = getSlideAngle(dx, dy);
    if(angle >= 45 && angle < 135){
        result = 1;
    }else if(angle >= 135 && angle < 225){
        result = 2;
    }else if(angle >= 225 && angle < 315 ){
        result = 3;
    }else if(angle >= 315 && angle < 405){
        result = 4;
    }
    return result;
};

//滑動處理
const cards = document.querySelectorAll(".card");
let startX, startY, endX, endY, index;

cards.forEach((card, i) => card.addEventListener('touchstart', (event) => {
    startX = event.touches[0].pageX; //https://www.w3schools.com/jsref/event_touch_touches.asp
    startY = event.touches[0].pageY;
    index = i;
}));

cards.forEach(card => card.addEventListener('touchmove', (event) => {
// cards.forEach(card => card.addEventListener('touchend', (event) => {
    endX = event.changedTouches[0].pageX; 
    endY = event.changedTouches[0].pageY;
}));
let direction = getSlideDirection(startX, startY, endX, endY);


//------------------------- drag & drop --------------------------
//1. https://www.w3schools.com/html/html5_draganddrop.asp
//2. https://javascript.info/mouse-drag-and-drop
//3. https://developer.mozilla.org/en-US/docs/Web/Events/drag (用這個)
var dragged;
        /* events fired on the draggable target */
        document.addEventListener("drag", function( event ) {
      
        }, false);
      
        document.addEventListener("dragstart", function( event ) {
            ondragstart=event.dataTransfer.setData('text/plain',null);
            // store a ref. on the dragged elem
            dragged = event.target;
            // make it half transparent
            // event.target.style.opacity = .5;
        }, false);
      
        document.addEventListener("dragend", function( event ) {
            // reset the transparency
            event.target.style.opacity = "";
        }, false);
      
        /* events fired on the drop targets */
        document.addEventListener("dragover", function( event ) {
            // prevent default to allow drop
            event.preventDefault();
        }, false);
      
        document.addEventListener("dragenter", function( event ) {
            // highlight potential drop target when the draggable element enters it
            if ( event.target.className.includes("dropzone")) {
                event.target.style.background = "#adadad";
            }
      
        }, false);
      
        document.addEventListener("dragleave", function( event ) {
            // reset background of potential drop target when the draggable element leaves it
            if ( event.target.className.includes("dropzone")) {
                event.target.style.background = "";
            }
      
        }, false);
      
        document.addEventListener("drop", function( event ) {
            // prevent default action (open as link for some elements)
            event.preventDefault();
            // move dragged elem to the selected drop target
            if ( event.target.className.includes("dropzone")) {
                console.log(event.target.className);
                event.target.style.background = "";
                dragged.parentNode.removeChild( dragged );
                event.target.appendChild( dragged );
            }
          
        }, false);