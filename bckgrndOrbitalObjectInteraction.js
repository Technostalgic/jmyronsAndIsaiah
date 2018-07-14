///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// the orbiter objects that are being tracked
var trackedOrbiters = [];

function findOrbiterObjFromElement(element){
    return trackedOrbiters[0];
    for(let orbiter of trackedOrbiters)
        if(orbiter.element.style.left == element.style.left)
            if(orbiter.element.style.top == element.style.top)
                return orbiter;
}

function trackOrbiter(orbiterElement){
    // tells the code to start tracking an orbiter element
    orbiterElement.addEventListener("mouseenter", listener_mouseEnterOrbiter);
    orbiterElement.addEventListener("mouseout", listener_mouseOutOrbiter);
    
    // creates an object out of the orbiter element
    let orbiterObj = {
        element: orbiterElement,
        time_mouseEnter: 0,
        time_mouseOut: 0,
        animMode: 0
    };
    trackedOrbiters.push(orbiterObj);
}

function updateOrbiterAnim(orbiter){
    let minSize = 20;
    let maxSize = 100;
    let animPeriod = 500;
    let curSize = 0;

    // if the mouse is over
    if(orbiter.animMode > 0){
        curSize = (orbiter.time_mouseEnter + animPeriod) - performance.now();
        if(curSize > 0){
            curSize /= animPeriod;
            curSize = (maxSize - minSize) * (1 - curSize);
            curSize += minSize;
        } else curSize = maxSize;
    }

    // if the mouse has exited
    else{
        curSize = (orbiter.time_mouseOut + animPeriod) - performance.now();
        if(curSize > 0){
            curSize /= animPeriod;
            curSize = (maxSize - minSize) * (curSize);
            curSize += minSize;
        } else curSize = minSize;
    }

    orbiter.element.style.width = Math.round(curSize).toString() + "px";
    orbiter.element.style.height = Math.round(curSize).toString() + "px";
}
function updateAllOrbiterAnims(){
    trackedOrbiters.forEach(function(orbiter){
        updateOrbiterAnim(orbiter);
    })
}

function init_mouseHandlers(){
    // attach the handlers to the preExisting orbiter objects
    let orbiters = document.getElementsByClassName("orbiter");
    for(let i = orbiters.length - 1; i >= 0; i--)
        trackOrbiter(orbiters.item(i));
}

function listener_addElement(e){

}

function listener_mouseEnterOrbiter(e){
    let orbiter = findOrbiterObjFromElement(e);

    orbiter.time_mouseEnter = performance.now();
    orbiter.animMode = 1;
}
function listener_mouseOutOrbiter(e){
    let orbiter = findOrbiterObjFromElement(e);

    orbiter.time_mouseOut = performance.now();
    orbiter.animMode = 0;
}

window.addEventListener("load", function(){
    init_mouseHandlers();
    setInterval(updateAllOrbiterAnims, 10);
    console.log("LOADED");
});