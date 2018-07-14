var jmyrons = jmyrons || {};  //global namespace object

jmyrons.htmlRenderer = function(sceneObjs) {
  for (let i = 0; i < sceneObjs.length; i++) {
    let elemObj = document.getElementById(sceneObjs[i].cfg.id);
    if (elemObj === null) {
      elemObj = document.createElement("div");
      elemObj.setAttribute("id", sceneObjs[i].cfg.id);
      elemObj.setAttribute("class","orbiter");
      document.body.appendChild(elemObj);
    }
    let location = sceneObjs[i].getLocation();
    elemObj.setAttribute("style", "background-color:#" + sceneObjs[i].cfg.color + "; top:" + location.y + "px; left:" + location.x + "px;")
  }
}

jmyrons.BckgrndOrbitalObject = function(cfg) {
  if (typeof cfg.orbit.radius === "string") {
    cfg.orbit.radius = parseInt(cfg.orbit.radius);
  }
  if (cfg.orbit.radius === NaN || (cfg.orbit.radius < 10 || cfg.orbit.radius > 1000 )) {
    alert("cfg.orbit.radius must be a number between 10 and 1000");
    return;
  }
  if (cfg.color < 0x0 || cfg.color > 0xFFFFFF ) {
    alert("cfg.color must be a hex number between 0 and FFFFFF");
    return;
  }
  if (typeof cfg.orbit.period === "string") { 
    cfg.orbit.period = parseInt(cfg.orbit.period);
  }
  if (cfg.orbit.period === NaN || (cfg.orbit.period < 1 || cfg.orbit.period > 30 )) {
    alert("cfg.orbit.period must be a number between 1 and 30");
    return;
  }
  
  if (typeof cfg.orbit.offset.x === "string") {
    cfg.orbit.offset.x = parseInt(cfg.orbit.offset.x);
  }
  if (cfg.orbit.offset.x === NaN || (cfg.orbit.offset.x < 0 || cfg.orbit.offset.x > 1000 )) {
    alert("cfg.orbit.offset.x must be a number between 0 and 1000");
    return;
  }
  
  if (typeof cfg.orbit.offset.y === "string") {
    cfg.orbit.offset.y = parseInt(cfg.orbit.offset.y);
  }
  if (cfg.orbit.offset.y === NaN || (cfg.orbit.offset.y < 0 || cfg.orbit.offset.y > 1000 )) {
    alert("cfg.orbit.offset.y must be a number between 0 and 1000");
    return;
  }
  
  if (typeof cfg.renderer !== "function") {
    alert("Configuration Error: A callable function must be passed in for the configuration renderer");
    return;
  }
  
  var moon = function() {
    let timerId = null;
    let milisecsPerFrame = 1000 / cfg.orbit.fps;
    let curRenderIndex = 0;
    let locations = null;
    let frame = 0;
    let maxFrames;

    function calcLocations() {
      locations = [];
      maxFrames = cfg.orbit.period * cfg.fps;
      let piTimes2 = 2 * Math.PI;
      // instead of doing the math on the fly just create a table of possible postions within any single orbit
      for (let i = 0; i < maxFrames; i++) {
        locations[i] = {x:Math.round(cfg.orbit.radius * Math.cos(cfg.startAngle + (piTimes2 * i)/maxFrames)) + cfg.orbit.offset.x,
                        y:Math.round(cfg.orbit.radius * Math.sin(cfg.startAngle + (piTimes2 * i)/maxFrames)) + cfg.orbit.offset.y};
      }
    }

    if (locations === null) {
      calcLocations();
    }

    return {
      nextLocation: () => {
        frame += 1;
        frame = frame < maxFrames ? frame : 0;
        return locations[frame];
      },
      setFps: (fps) => {
        cfg.fps = fps;
        calcLocations();
      }
    }
  }();

  return {
    cfg: cfg,
    getLocation: moon.nextLocation,
    setFps: moon.setFps
  }
}