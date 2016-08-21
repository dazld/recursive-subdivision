// import Node from './lib/node';
import hw from './lib/window-size';
import Voronoi from 'voronoi';
import { relaxSites } from './lib/relax';
import { ctx, canvas } from './lib/frame';
window.ctx = ctx;


const voronoi = new Voronoi();

function render(diagram, sites) {
    ctx.globalAlpha = 1;
	// voronoi
	// edges
    ctx.beginPath();
    // ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.2;
    diagram.cells.forEach(function(cell) {
        if (cell.halfedges.length < 3) {
            console.log('skip')
            return;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgb(${(cell.site.depth/md)*128},32,32)`;
        const start = cell.halfedges[0].getStartpoint();
        ctx.moveTo(start.x, start.y)
        cell.halfedges.forEach(function(e) {
            const p = e.getEndpoint();
            ctx.lineTo(p.x, p.y);
        });
        // ctx.closePath();
        // ctx.stroke();
        ctx.fill();
    });
    // const edges = diagram.edges;
    // let iEdge = edges.length;
    // let edge;
    // let v;
    // while (iEdge--) {
    //     edge = edges[iEdge];
    //     v = edge.va;
    //     ctx.moveTo(v.x, v.y);
    //     v = edge.vb;
    //     ctx.lineTo(v.x, v.y);
    // }
    // ctx.stroke();
    // sites
    // ctx.beginPath();
    // ctx.fillStyle = '#44f';
    // let iSite = sites.length;
    // while (iSite--) {
    //     v = sites[iSite];
    //     ctx.rect(v.x - 2 / 3, v.y - 2 / 3, 2, 2);
    // }


    // ctx.fill();
}
function doIt() {
    return Math.random() > 0.4;
}

// const spacing = 2;
const bbox = {
    xl: -1,
    xr: window.innerWidth + 1,
    yt: -1,
    yb: window.innerHeight + 1
};

let points = [];
var md = 0;

function makeSquare(x, y, size, depth = 1) {

    // const square = document.createElement('div');
    // square.className = `square level${depth}`;
    // square.style.top = wrapInPx(x + spacing / 2);
    // square.style.left = wrapInPx(y + spacing / 2);
    // square.style.height = wrapInPx(size - spacing / 2);
    // square.style.width = wrapInPx(size - spacing / 2);
    // square.style.zIndex = depth;

    const recurse = doIt();
    const hs = (size / 2);
    if (recurse && size > 4) {
        const nextDepth = depth + 1;

        makeSquare(x, y, hs, nextDepth);
        makeSquare(x + hs, y, hs, nextDepth);
        makeSquare(x, y + hs, hs, nextDepth);
        makeSquare(x + hs, y + hs, hs, nextDepth);
    } else {
        if (depth > md) {
            md = depth;
        }
        points.push({
            x: x + hs,
            y: y + hs,
            depth
        });
    }
    // return square;
}

console.log(md)
const size = 512;
window.diagram = null;
function resetPoints() {
    points = [];
    for (let x = 0; x < hw.width; x += size) {
        for (let y = 0; y < hw.height; y += size) {
            makeSquare(x, y, size, 1);
        }
    }
    diagram = voronoi.compute(points, bbox);
}
resetPoints();
const clickPoints = [];
let restart = false;
function anim() {
    let nextpoints;
    try {
        if (restart) {
            restart = false;
            throw 'restarting';

        }
        nextpoints = relaxSites(diagram);
        if (clickPoints.length) {
            nextpoints.push(clickPoints.pop());
        }
        // voronoi.recycle(diagram);
        diagram = voronoi.compute(nextpoints, bbox);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        render(diagram, nextpoints);
        requestAnimationFrame(anim);
    } catch (e) {
        console.log(e)
        resetPoints();
        requestAnimationFrame(anim);
    }
}
anim();

canvas.addEventListener('click', function(e){
    restart = true;
});
