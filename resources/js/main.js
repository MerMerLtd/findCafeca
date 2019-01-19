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
            let shiftX = touchPoint.clientX - card.getBoundingClientRect().left;
            let shiftY = touchPoint.clientY - card.getBoundingClientRect().top;

            startX = touchPoint.pageX; 
            startY = touchPoint.pageY;

            event.target.style.top = event.pageY - shiftY + 'px';
            event.target.style.left = event.pageX - shiftX + 'px';
            event.target.style.transfrom = "translate(-3px, -3px)";

            document.ontouchmove = event => {
                event.preventDefault();
                let touchPoint = event.targetTouches[0]
                endX = touchPoint.pageX; 
                endY = touchPoint.pageY;


            }

            document.ontouchend = () => {
                slideDirection = getSlideDirection(startX, startY, endX, endY);
                if(slideDirection === 2){
                    console.log("左邊");
                }else if(slideDirection === 4){
                    console.log("右邊");
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
                if(touchPoint.pageX >= 70 && touchPoint.pageX <= 380 && touchPoint.pageY >= 900 && touchPoint.pageY <= 1250 ){
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
