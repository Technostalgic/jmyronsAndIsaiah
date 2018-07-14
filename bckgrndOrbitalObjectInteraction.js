///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// the orbiter objects that are being tracked
var trackedOrbiters = [];
var animPeriod = 150;
var nextUID = 0;

function getNextUID(){
    nextUID++;
    return nextUID;
}
function findOrbiterObjFromElement(element){
    for(let orbiter of trackedOrbiters)
        if(element.getAttribute("orbiteruid") == orbiter.UID)
            return orbiter;
}

function trackOrbiter(orbiterElement){
    // tells the code to start tracking an orbiter element
    orbiterElement.addEventListener("mouseenter", listener_mouseEnterOrbiter);
    orbiterElement.addEventListener("mouseout", listener_mouseOutOrbiter);
    
    let uid = getNextUID();
    orbiterElement.setAttribute("orbiteruid", uid.toString());

    // creates an object out of the orbiter element
    let orbiterObj = {
        element: orbiterElement,
        time_mouseEnter: 0,
        time_mouseOut: 0,
        isAnimating: false,
        animMode: 0,
        animCorrection: 0,
        UID: uid
    };
    trackedOrbiters.push(orbiterObj);
}

function updateOrbiterAnim(orbiter){
    // updates the width and height of the div element to fit the expansion animation
    let minSize = 20;
    let maxSize = 100;
    let curSize = 0;

    // if the mouse is over
    if(orbiter.animMode > 0){
        curSize = (orbiter.time_mouseEnter + animPeriod - orbiter.animCorrection) - performance.now();
        if(curSize > 0){
            curSize /= animPeriod;
            curSize *= curSize;
            curSize = (maxSize - minSize) * (1 - curSize);
            curSize += minSize;
        } else {
            curSize = maxSize;
            orbiter.animCorrection = 0;
            orbiter.isAnimating = false;
        }
    }

    // if the mouse has exited
    else{
        curSize = (orbiter.time_mouseOut + animPeriod - orbiter.animCorrection) - performance.now();
        if(curSize > 0){
            curSize /= animPeriod;
            curSize = Math.sqrt(curSize);
            curSize = (maxSize - minSize) * curSize;
            curSize += minSize;
        } else {
            curSize = minSize;
            orbiter.animCorrection = 0;
            orbiter.isAnimating = false;
        }
    }

    // set the orbiter element style's width and height to resize it for the expand/collapse animation
    orbiter.element.style.width = Math.round(curSize).toString() + "px";
    orbiter.element.style.height = Math.round(curSize).toString() + "px";
}
function updateAllOrbiterAnims(){
    // updates the expand animation for all the tracked orbiters
    trackedOrbiters.forEach(function(orbiter){
        if(orbiter.isAnimating)
            updateOrbiterAnim(orbiter);
        else orbiter.animCorrection = 0;
    })
}

function init_mouseHandlers(){
    // attach the handlers to the preExisting orbiter objects
    let orbiters = document.getElementsByClassName("orbiter");
    for(let i = orbiters.length - 1; i >= 0; i--)
        trackOrbiter(orbiters.item(i));
}

function listener_mouseEnterOrbiter(e){
    // called when the mouse hovers over the orbiter
    let orbiter = findOrbiterObjFromElement(e.target);

    // set the animation correcction for when the mouse is moved over the orbiter element before the collapsing animation is complete
    let correction = orbiter.time_mouseOut + animPeriod + orbiter.animCorrection - performance.now();
    if(correction < 0) correction = 0;
    orbiter.animCorrection = correction - orbiter.animCorrection;

    orbiter.isAnimating = true;
    orbiter.time_mouseEnter = performance.now();
    orbiter.animMode = 1;
}
function listener_mouseOutOrbiter(e){
    // called when the mouse hovers outside the orbiter
    let orbiter = findOrbiterObjFromElement(e.target);

    // set the animation correcction for when the mouse is moved over the orbiter element before the collapsing animation is complete
    let correction = orbiter.time_mouseEnter + animPeriod + orbiter.animCorrection - performance.now();
    if(correction < 0) correction = 0;
    orbiter.animCorrection = correction - orbiter.animCorrection;

    orbiter.isAnimating = true;
    orbiter.time_mouseOut = performance.now();
    orbiter.animMode = 0;
}

window.addEventListener("load", function(){
    init_mouseHandlers();
    setInterval(updateAllOrbiterAnims, 16);
    console.log("LOADED");
});