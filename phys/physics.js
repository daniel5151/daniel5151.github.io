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
    obj.fy = (obj.suspendForces == false) ? (fyGrav + fyDrag) : 0;
    obj.fx = (obj.suspendForces == false) ? (fxGrav + fxDrag) : 0;
	
    obj.dy += obj.fy / obj.mass/simSpeed / uVars.fps;
    obj.dx += obj.fx / obj.mass/simSpeed / uVars.fps;

	// Ball-ball Collisions
	
	
	
    for (ball in objects) {
		if (objects[ball].id != obj.id && lineDistance([obj.x,obj.y],[objects[ball].x,objects[ball].y]) < (obj.r + objects[ball].r) * uVars.scale ) {
			collision(objects[obj.id], objects[ball]);
		}
	}
	
    // Apply Motion
    obj.x += obj.dx / simSpeed / uVars.fps * uVars.scale;
    obj.y += -obj.dy / simSpeed / uVars.fps * uVars.scale;

    // Store Coordinates
    obj.prevCords.push([obj.x, obj.y]);
    obj.prevCords.shift();
}

function collision(ball1, ball2) {
    /*ball1.dx = -(ball1.dx * (ball1.mass - ball2.mass) - 2 * ball2.mass * ball2.dx) / (ball1.mass + ball2.mass);
    ball1.dy = -(ball1.dy * (ball1.mass - ball2.mass) - 2 * ball2.mass * ball2.dy) / (ball1.mass + ball2.mass);
    ball2.dx = (ball2.dx * (ball2.mass - ball1.mass) - 2 * ball1.mass * ball1.dx) / (ball1.mass + ball2.mass);
    ball2.dy = (ball2.dy * (ball2.mass - ball1.mass) - 2 * ball1.mass * ball1.dy) / (ball1.mass + ball2.mass);*/
    var ballTangent = slope([ball1.x,ball1.y], [ball2.x,ball2.y]);
	var ballReflectionAngle = Math.atan(-1 / ballTangent);
	
	ball1.initialAngle = Math.atan(ball1.dy / ball1.dx);
	ball2.initialAngle = Math.atan(ball2.dy / ball2.dx);
	
	ball1.reflectionAngle = 2 * ballReflectionAngle - ball1.initialAngle;
	ball2.reflectionAngle = 2 * ballReflectionAngle - ball2.initialAngle;
	
	ball1.dTotal = Math.sqrt(ball1.dx * ball1.dx + ball1.dy * ball1.dy);
	ball2.dTotal = Math.sqrt(ball2.dx * ball2.dx + ball2.dy * ball2.dy);
	
	ball1.dx = ball1.dTotal * Math.cos(ball1.reflectionAngle);
	ball2.dx = ball2.dTotal * Math.cos(ball2.reflectionAngle);
	ball1.dy = ball1.dTotal * Math.sin(ball1.reflectionAngle);
	ball2.dy = ball2.dTotal * Math.sin(ball2.reflectionAngle);
	
	/*if (lineDistance([ball1.x,ball1.y],[ball2.x,ball2.y]) < (ball1.r + ball2.r) * uVars.scale) {
		if (ball1.x > ball2.x) {
			ball1.x += Math.cos(ballAngle);
			ball2.x -= Math.cos(ballAngle);
		} else if (ball1.x <ball2.x) {
			ball1.x -= Math.cos(ballAngle);
			ball2.x += Math.cos(ballAngle);
		}
		if (ball1.y > ball2.y) {
			ball1.y += Math.sin(ballAngle);
			ball2.y -= Math.sin(ballAngle);
		} else if (ball1.y < ball2.y) {
			ball1.y -= Math.sin(ballAngle);
			ball2.y += Math.sin(ballAngle);
		}
	}*/
	/*ball1.x = ball2.x  (ball1.r + ball2.r) * uVars.scale * Math.cos(ballAngle);
	ball1.y = ball2.y - (ball1.r + ball2.r) * uVars.scale * Math.sin(ballAngle);
	ball2.x = (ball1.r + ball2.r) * uVars.scale * Math.cos(ballAngle);
	ball2.y = (ball1.r + ball2.r) * uVars.scale * Math.sin(ballAngle);*/
	
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
