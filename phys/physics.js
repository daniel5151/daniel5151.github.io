// Physics
function circlePhys(obj) { //HOLY SHITSNACKS, THIS NEEDS A REWRITE
    var simSpeed = uVars.simSpeed;
    var h = canvas.h;
    var w = canvas.w;

    //Check if Out of Bounds
    if (obj.y + obj.r * uVars.scale > h) {
        obj.y = h - obj.r * uVars.scale;
        obj.dy = obj.dy * obj.restitution;
    }
    if (obj.y - obj.r * uVars.scale < 0) {
        obj.y = 0 + obj.r * uVars.scale;
        obj.dy = obj.dy * obj.restitution;
    }
    if (obj.x + obj.r * uVars.scale > w) {
        obj.x = w - obj.r * uVars.scale;
        obj.dx = obj.dx * obj.restitution;
    }
    if (obj.x - obj.r * uVars.scale < 0) {
        obj.x = 0 + obj.r * uVars.scale;
        obj.dx = obj.dx * obj.restitution;
    }

    // Gravity
    var fyGrav = obj.mass * Math.sin(uVars.gravity.angle) * uVars.gravity.accel;
    var fxGrav = obj.mass * Math.cos(uVars.gravity.angle) * uVars.gravity.accel;
    
    // Air Restitance
    var fyDrag = -0.5 * obj.cDrag * obj.area * uVars.dFluid * obj.dy * obj.dy * (obj.dy / Math.abs(obj.dy));
    var fxDrag = -0.5 * obj.cDrag * obj.area * uVars.dFluid * obj.dx * obj.dx * (obj.dx / Math.abs(obj.dx));
    
	fxDrag = (isNaN(fxDrag) ? 0 : fxDrag);
	fyDrag = (isNaN(fyDrag) ? 0 : fyDrag);
	
    // Apply Forces
    obj.fy = fyGrav + fyDrag;
    obj.fx = fxGrav + fxDrag;
	
    obj.dy += obj.fy / obj.mass/simSpeed / uVars.fps;
    obj.dx += obj.fx / obj.mass/simSpeed / uVars.fps;
    
    // Apply Motion
    obj.x += obj.dx / simSpeed / uVars.fps * uVars.scale;
    obj.y += -obj.dy / simSpeed / uVars.fps * uVars.scale;

    // Store Coordinates
    obj.prevCords.push([obj.x, obj.y]);
    obj.prevCords.shift();
}

// Paused
var paused = false;

function pause() {
    if (!paused) {
        paused = true;
    } else {
        paused = false;
    }
}

function mainPhysLoop() {
    if (!paused) {
        for (var key in objects) {
            if (objects[key].suspendPhysics !== true) {
                circlePhys(objects[key]);
            }
        }
    } else {
        draw.extraDraw.paused = function () {
            draw.writeMessage('Paused', 0, canvas.h - 5);
        };
    }
}
