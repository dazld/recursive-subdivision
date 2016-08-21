function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function cellArea(cell) {
    let area = 0;
    const halfedges = cell.halfedges;
    let iHalfedge = halfedges.length;
    let halfedge;
    let p1;
    let p2;
    while (iHalfedge--) {
        halfedge = halfedges[iHalfedge];
        p1 = halfedge.getStartpoint();
        p2 = halfedge.getEndpoint();
        area += p1.x * p2.y;
        area -= p1.y * p2.x;
    }
    area /= 2;
    return area;
}

function cellCentroid(cell) {
    let x = 0;
    let y = 0;
    const halfedges = cell.halfedges;
    let iHalfedge = halfedges.length;
    if (iHalfedge === 0) {
        return {
            x: cell.site.x,
            y: cell.site.y
        };
    }
    let halfedge;
    let v;
    let p1;
    let p2;
    while (iHalfedge--) {
        halfedge = halfedges[iHalfedge];
        p1 = halfedge.getStartpoint();
        p2 = halfedge.getEndpoint();
        v = p1.x * p2.y - p2.x * p1.y;
        x += (p1.x + p2.x) * v;
        y += (p1.y + p2.y) * v;
    }
    const area = cellArea(cell) * 6;
    return {
        x: x / area,
        y: y / area,
        depth: cell.site.depth,
        area: Math.abs(area)
    };
}

export function relaxSites(diagram) {
    const cells = diagram.cells;
    const sites = [];
    let iCell = cells.length;
    const p = 1 / iCell * 0.1;
    while (iCell--) {
        const cell = cells[iCell];
        // console.log(cell.site)
        const rn = Math.random();
        // probability of apoptosis
        if (rn < p) {
            continue;
        }
        const site = cellCentroid(cell);

        let dist = distance(site, cell.site);
        if (!dist) {
            continue;
        }
        // don't relax too fast
        if (dist > 2) {
            site.x = (site.x + cell.site.x) / 2;
            site.y = (site.y + cell.site.y) / 2;
        }
        // probability of mytosis
        if (rn > (1 - p)) {
            dist /= 2;
            const point = {
                x: site.x + (site.x - cell.site.x) / dist,
                y: site.y + (site.y - cell.site.y) / dist,
                depth: cell.site.depth
            };
            sites.push(point);
        }
        sites.push(site);
    }
    return sites;
}
