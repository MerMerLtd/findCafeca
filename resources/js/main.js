// ------------------------------滑屏-------------
參考https://github.com/git-onepixel/guesture/edit/master/js/app.js
https://www.cnblogs.com/onepixel/p/5300445.html

let currentPosition = 0; // 紀錄當前頁面位置

const viewport =  document.querySelector('.viewport');
let pageHeight = window.innerHeight; // 頁面高度
let maxHeight =  -pageHeight * 3; // 頁面滑動到最後一夜的位置
let initialPos = 0;  // 手指按下的屏幕位置
let moveLength = 0;  // 手指当前滑动的距离
let direction = 'left'; // 滑动的方向
let isMove = false; // 是否发生左右滑动
let startT = 0; // 记录手指按下去的时间
let isTouchEnd = true; // 标记当前滑动是否结束(手指已离开屏幕)  

const SlideScreen = event => {
    event.preventDefault();
    // 单手指触摸或者多手指同时触摸，禁止第二个手指延迟操作事件
    if (event.targetTouches.length === 1 || isTouchEnd) {
        let touchPoint = event.targetTouches[0];
        startX = touchPoint.pageX;
        startY = touchPoint.pageY;
        initialPos = currentPosition;   // 本次滑动前的初始位置
        viewport.style.webkitTransition = ''; // 取消动画效果
        startT = + new Date(); // 记录手指按下的开始时间
        isMove = false; // 是否产生滑动
        isTouchEnd = false; // 当前滑动开始

        document.ontouchmove = event => {
            event.preventDefault();
            // 如果当前滑动已结束，不管其他手指是否在屏幕上都禁止该事件
            if (isTouchEnd) return ;
            
            let touchPoint = event.targetTouches[0];
            let deltaX = touchPoint.pageX - startX;
            let deltaY = touchPoint.pageY - startY;
            
            let translate = initialPos + deltaY; // 当前需要移动到的位置
            // 如果translate>0 或 < maxHeight,则表示页面超出边界
            if (translate > 0) {
                translate = 0; 
            }
            if (translate < maxHeight) {
                translate = maxHeight; 
            }
            //頁面平移 
            // viewport.style.webkitTransform = 'translate3d( 0,' + translate + 'px, 0)';
            viewport.style.transform = `"translate3d(0, ${translate} px, 0)"`;
            console.log(`translate3d( 0, ${translate} px, 0)`);
            currentPosition = translate;

            isMove = true;
            moveLength = deltaY;
            direction = deltaY > 0 ? 'down' : 'up'; // 判断手指滑动的方向
            console.log(direction);
        }

        document.ontouchend = (event) => {
            event.preventDefault();
            translate = 0;
            // 计算手指在屏幕上停留的时间
            let deltaT = + new Date() - startT;
            // 发生了滑动，并且当前滑动事件未结束
            if (isMove && !isTouchEnd) { 
                isTouchEnd = true; // 标记当前完整的滑动事件已经结束 
                // 使用动画过渡让页面滑动到最终的位置
                viewport.style.webkitTransition = '0.3s ease -webkit-transform';
                if (deltaT < 300) { // 如果停留时间小于300ms,则认为是快速滑动，无论滑动距离是多少，都停留到下一页
                    if (currentPosition === 0 && translate === 0) {
                        return ;
                    }
                    translate = direction === 'up' ? 
                        currentPosition - (pageHeight + moveLength) 
                        : currentPosition + pageHeight - moveLength;
                    // 如果最终位置超过边界位置，则停留在边界位置
                    // 上边界
                    translate = translate > 0 ? 0 : translate; 
                    // 下边界
                    translate = translate < maxHeight ? maxHeight : translate; 
                } else {
                    // 如果滑动距离小于屏幕的50%，则退回到上一页
                    if (Math.abs(moveLength) / pageHeight < 0.5) {
                        translate = currentPosition - moveLength;
                    } else {
                        // 如果滑动距离大于屏幕的50%，则滑动到下一页
                        translate = direction === 'down'?
                        currentPosition - (pageHeight + moveLength) 
                        : currentPosition + pageHeight - moveLength;
                        translate = translate > 0 ? 0 : translate;
                        translate = translate < maxHeight ? maxHeight : translate;
                    }
                }
                // 执行滑动，让页面完整的显示到屏幕上
                // transform(viewport, translate);
            }
        }
    }
}

 手指放在屏幕上
 viewport.addEventListener('touchstart', SlideScreen, false);

//--------------------------
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

// 可以滑動換slide
const slideImgs = document.querySelectorAll(".slide");
slideImgs.forEach( slideImg => {
    const touchSlidingImg = event => {
        event.preventDefault();
        if(event.targetTouches.length === 1){
            let touchPoint = event.targetTouches[0];
            let startX, startY, endX, endY, slideDirection;
            startX = touchPoint.pageX; 
            startY = touchPoint.pageY;

            document.ontouchmove = event => {
                event.preventDefault();
                let touchPoint = event.targetTouches[0]
                endX = touchPoint.pageX; 
                endY = touchPoint.pageY;
            }

            document.ontouchend = () => {
                slideDirection = getSlideDirection(startX, startY, endX, endY);
                if(slideDirection === 2){
                    currentSlide(slideIndex+1);
                    console.log("left")
                }else if(slideDirection === 4){
                    currentSlide(slideIndex-1);
                    console.log("right");
                }else{
                    console.log("Nothing will happen");
                }
                document.ontouchend = null;
                document.ontouchmove = null;
            }
        }
    }
    slideImg.addEventListener("touchstart", touchSlidingImg, false);
});

//----------------------------------------------------------
// slide in puzzle card on scroll

//window.scrollY        // 取的瀏覽器視窗捲軸 Y 的高度（捲軸在最上方時是 0）
//window.innerHeight    // 瀏覽器內視窗的高度
//element.offsetTop     // 元素距離外層容器(父層元素)上方的距離
//element.height        // 元素的高度

// STEP1 選擇所有卡片盒子
const cardHolders = document.querySelectorAll(".card__holder");

// 選擇滑動提示
// const hint = document.querySelector(".card__slide-hint");

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
            
            // hint.classList.add('show');
        } else {
            cardHolder.classList.remove('active');
            // hint.classList.remove('show');
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
// cardHolders.forEach(card => card.addEventListener("mouseover",() => hint.classList.remove('show')));
// cardHolders.forEach(card => card.addEventListener("mouseout",() => hint.classList.add('show')));


//----------------------------------------------------------
// section-puzzle 卡片的各種操作
const cards = document.querySelectorAll(".card");
const dropZone = document.querySelector(".dropzone");
//移動裝置滑動屏幕方向判斷
//https://www.itread01.com/content/1531751882.html
//The atan2() method returns the arctangent of the quotient of its arguments, as a numeric value between PI and -PI radians.(by w3s)

//返回角度
const getSlideAngle = (dx, dy) => Math.atan2(dy, dx)*180/Math.PI;//With atan2(), the y coordinate is passed as the first argument and the x coordinate is passed as the second argument.

//根據起點和終點返回方向判斷1:上，2:左，3:下，4:右，0:未滑動
const getSlideDirection = (startX, startY, endX, endY) => {
    let dy = startY - endY;//標準座標系與屏幕座標系的Y軸方向相反
    let dx = endX - startX;
    let result = 0;
    // console.log("dx: " + dx, "dy: " + dy);

    //如果滑動距離太短
    if(Math.abs(dx)<2 && Math.abs(dy)<2){
        return result;
    }

    let angle = getSlideAngle(dx, dy);
    // console.log("angle: " + angle);
    if(angle >= 45 && angle < 135){
        result = 1; //上
        // console.log("up");
    }else if((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)){
        result = 2; //左
        // console.log("left");
    }else if(angle >= -135 && angle < -45){
        result = 3;// 下
        // console.log("down");
    }else if(angle >= -45 && angle < 45){
        result = 4;// 右
        // console.log("right");
    }
    return result;
};

let isCardBoxEmpty = true;
let isInCarBox = false;
let startX, startY, endX, endY, index, slideDirection;
let answer = [];

cards.forEach((card, i) => {

    //------------------------ sliding card --------------------------
    const touchSliding = event => {
        event.preventDefault(); 
        if(event.targetTouches.length === 1){
            console.log("oh yeah!");
            let touchPoint = event.targetTouches[0]
            startX = touchPoint.pageX; 
            startY = touchPoint.pageY;

            document.ontouchmove = event => {
                event.preventDefault();
                let touchPoint = event.targetTouches[0]
                endX = touchPoint.pageX; 
                endY = touchPoint.pageY;
            }

            document.ontouchend = () => {
                slideDirection = getSlideDirection(startX, startY, endX, endY);
                if(slideDirection === 2){
                    answer.push(0);
                    card.className += " " + "fadeOutLeft";
                    isCardBoxEmpty = true;    
                    console.log("左邊");
                    console.log(answer);
                }else if(slideDirection === 4){
                    answer.push(1);
                    card.className += " " + "fadeOutRight";
                    isCardBoxEmpty = true;
                    console.log("右邊");
                    console.log(answer);
                }else{
                    console.log("請往左或右滑動卡片");
                }
                document.ontouchend = null;
                document.ontouchmove = null;
            }
        }
    }


    //------------------------- drag & drop --------------------------
    // 參考作法: https://javascript.info/mouse-drag-and-drop

    // mouse event
    const mouseDragging =  event => {
        // console.log(event);
        let shiftX = event.clientX - card.getBoundingClientRect().left;
        let shiftY = event.clientY - card.getBoundingClientRect().top;
      
        //(1)產生卡片複本 參考作法: https://blog.csdn.net/ldw201510803006/article/details/75205821
        let cardCopy = document.createElement("div");
        cardCopy.className= "card__side--front";
        cardCopy.style.opacity = "0.5";
        cardCopy.style.position = 'absolute';
        cardCopy.style.height = card.offsetHeight + "px";
        cardCopy.style.width = card.offsetWidth + "px";

        document.body.appendChild(cardCopy);
      
        moveAt(event.pageX, event.pageY);
      
        // centers the cardCopy at (pageX, pageY) coordinates
        function moveAt(pageX, pageY) {
            cardCopy.style.left = pageX - shiftX + 'px';
            cardCopy.style.top = pageY - shiftY + 'px';
        }
    
        // move the card on mousemove
        document.onmousemove = event => {
            event.preventDefault();
            moveAt(event.pageX, event.pageY);
            isInCarBox = false;
            dropZone.style.background = "";
        //if(到某一範圍內){
                isInCarBox = true;
                dropZone.style.background = "#d2d2d2";
        // }
        }
    
        // drop the card, remove unneeded handlers
        document.onmouseup = function() {
            if(isInCarBox && isCardBoxEmpty){
               dropZone.style.background = "";
                    dropZone.appendChild(card);
                    isCardBoxEmpty = false;
                    card.className += " " + "flip";
                    card.removeEventListener("mousedown", mouseDragging);  
                    // card.addEventListener("mousedown", mouseSliding, false);
            }
            document.body.removeChild(cardCopy);
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }  
      card.ondragstart = function() {
        return false;
      };

    // touch event
    const touchDragging = event => {
        event.preventDefault(); 
        if(event.targetTouches.length === 1){ 
            
            //(start)
            let touchPoint = event.targetTouches[0];//獲取觸摸的初始位置 touchPoint.clientX & touchPoint.clientY
            let shiftX = touchPoint.clientX - card.getBoundingClientRect().left;
            let shiftY = touchPoint.clientY - card.getBoundingClientRect().top;

            //(1)產生卡片複本 參考作法: https://blog.csdn.net/ldw201510803006/article/details/75205821
            let cardCopy = document.createElement("div");
            cardCopy.className= "card__side--front";
            cardCopy.style.opacity = "0.5";
            cardCopy.style.position = 'absolute';
            cardCopy.style.height = card.offsetHeight + "px";
            cardCopy.style.width = card.offsetWidth + "px";

            document.body.appendChild(cardCopy);

            cardCopy.style.top = touchPoint.pageY - shiftY + 'px';
            cardCopy.style.left = touchPoint.pageX - shiftX + 'px';
        
            // centers the card at (pageX, pageY) coordinates
            const moveAt = (pageX, pageY) => {
                cardCopy.style.left = pageX - shiftX + 'px';
                cardCopy.style.top = pageY - shiftY + 'px';
            }

            moveAt(touchPoint.pageX, touchPoint.pageY);
            
            // move the card on mousemove
            document.ontouchmove = event => {
                event.preventDefault();
                let touchPoint = event.targetTouches[0]
                moveAt(touchPoint.pageX, touchPoint.pageY);
                isInCarBox = false;
                dropZone.style.background = "";
                if(touchPoint.pageX >= 10 && touchPoint.pageX <= 380 && touchPoint.pageY >= 900 && touchPoint.pageY <= 1350 ){
                    isInCarBox = true;
                    dropZone.style.background = "#d2d2d2";
                }
            }
        
            // drop the card, remove unneeded handlers
            document.ontouchend = () => {
                if(isInCarBox && isCardBoxEmpty){
                    dropZone.style.background = "";
                    dropZone.appendChild(card);
                    isCardBoxEmpty = false;
                    card.className += " " + "flip";
                    card.removeEventListener("touchstart", touchDragging);  
                    card.addEventListener("touchstart", touchSliding, false);
                    const flipCardAfterAnimaton = event => {
                        card.style.transform = "rotateY(180deg)";
                        card.removeEventListener("animationend", flipCardAfterAnimaton);
                    }
                    card.addEventListener("animationend", flipCardAfterAnimaton, false);
                }
                document.body.removeChild(cardCopy);
                document.ontouchend = null;
                document.ontouchmove = null;
            }
        }
    }
    card.addEventListener("mousedown", mouseDragging, false); 
    card.addEventListener("touchstart", touchDragging, false);
});
 