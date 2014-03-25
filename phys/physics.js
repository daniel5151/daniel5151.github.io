// Physics
function circlePhys(obj) { //HOLY SHITSNACKS, THIS NEEDS A REWRITE
    var simSpeed = uVars.simSpeed;
    var h = canvas.h;
    var w = canvas.w;

    //Check if Out of Bounds
    if (obj.y+obj.r > h) {
        obj.y=h-obj.r;
        obj.dy = -obj.dy;
    }
    if (obj.y-obj.r < 0) {
        obj.y=0+obj.r;
        obj.dy = -obj.dy;
    }
    if (obj.x+obj.r > w) {
        obj.x=w-obj.r;
        obj.dx = -obj.dx;
    }
    if (obj.x-obj.r < 0) {
        obj.x=0+obj.r;
        obj.dx = -obj.dx;
    }

    // Gravity
    var fyGrav = obj.mass * Math.sin(uVars.gravity.angle) * uVars.gravity.accel;
	var fxGrav = obj.mass * Math.cos(uVars.gravity.angle) * uVars.gravity.accel;
	
	// Apply Forces
	obj.fy = fyGrav;
	obj.fx = fxGrav;
	
	obj.dy += obj.fy / obj.mass;
	obj.dx += obj.fx / obj.mass;
	
	// Apply Motion
	obj.x += obj.dx/simSpeed/uVars.scale;
    obj.y += obj.dy/simSpeed/uVars.scale;

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
