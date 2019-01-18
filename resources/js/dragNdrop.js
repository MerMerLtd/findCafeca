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