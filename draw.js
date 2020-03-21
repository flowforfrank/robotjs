const robot = require('robotjs');

// https://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
const getIntersection = (circle1, circle2) => {
    let a, dx, dy, d, h, rx, ry;
    let x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = circle2.x - circle1.x;
    dy = circle2.y - circle1.y;

    /* Determine the straight-line distance between the centers. */
    d = Math.hypot(dx, dy);

    /* Determine the distance from point 0 to point 2. */
    a = ((circle1.radius * circle1.radius) - (circle2.radius * circle2.radius) + (d * d)) / (2.0 * d);

    /* Determine the coordinates of point 2. */
    x2 = circle1.x + (dx * a/d);
    y2 = circle1.y + (dy * a/d);

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt((circle1.radius * circle1.radius) - (a * a));

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h/d);
    ry = dx * (h/d);

    /* Determine the absolute intersection points. */
    const xi = x2 + rx;
    const xi_prime = x2 - rx;
    const yi = y2 + ry;
    const yi_prime = y2 - ry;

    return [xi, xi_prime, yi, yi_prime];
};

const outerRadius = 200;
const innerRadius = 100;

const canvas = { width: 960, height: 580 };
const anchor = { x: 200, y: 227 }

const startX = anchor.x + (canvas.width / 2);
const startY = anchor.y + (canvas.height / 2) - (outerRadius / 2);

let intersection;

const outerCircle  = { x: startX, y: startY, radius: outerRadius };
const innerCircle  = { x: startX, y: startY, radius: innerRadius };
const topCircle    = { x: startX, y: startY - innerRadius, radius: innerRadius };
const bottomCircle = { x: startX, y: startY + innerRadius, radius: innerRadius };

intersection = getIntersection(innerCircle, topCircle);

const topLeftCircle =  { x: intersection[0], y: intersection[2], radius: innerRadius };
const topRightCircle = { x: intersection[1], y: intersection[2], radius: innerRadius };

intersection = getIntersection(innerCircle, bottomCircle);

const bottomLeftCircle =  { x: intersection[0], y: intersection[2], radius: innerRadius };
const bottomRightCircle = { x: intersection[1], y: intersection[2], radius: innerRadius };

const circles = [
    outerCircle,
    innerCircle,
    topCircle,
    bottomCircle,
    topLeftCircle,
    topRightCircle,
    bottomLeftCircle,
    bottomRightCircle
];

const drawCircle = radius => {
    const mousePos = robot.getMousePos();

    for (let i = 0; i <= Math.PI * 2 + 0.1; i += 0.01) {
        // Convert polar coordinates to cartesian
        const x = mousePos.x + (radius * Math.cos(i));
        const y = mousePos.y + (radius * Math.sin(i));
        
        robot.dragMouse(x, y);
    }
};

// Speed up the mouse.
robot.setMouseDelay(2);

circles.forEach(circle => {
    robot.moveMouse(circle.x, circle.y);
    robot.mouseToggle('down');

    drawCircle(circle.radius);

    robot.mouseToggle('up');
});