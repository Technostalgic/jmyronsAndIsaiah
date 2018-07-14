///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

function debug_init(){
    let orbiters = document.getElementsByClassName("orbiter");
    let maxX = window.innerWidth;
    let maxY = window.innerHeight;

    for(let orbiter of orbiters){
        let nX = Math.floor(maxX * Math.random());
        let nY = Math.floor(maxY * Math.random());

        orbiter.style.left = nX;
        orbiter.style.top = nY;
    }
}

debug_init();