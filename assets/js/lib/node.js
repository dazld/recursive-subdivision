class Node {
    constructor(x, y, size, depth, parent = null) {
        this.update(x, y, depth, parent);
        this.children = {};
    }
    link(node, bidi = true) {
        this.children[Node.hash(node)] = node;
        if (bidi) node.link(this, false);
    }
    unlink(node, bidi = true) {
        delete this.children[Node.hash(node)];
        if (bidi) node.unlink(this, false);
    }
    update(x, y, size, depth, parent) {
        this.x = x;
        this.y = y;
        this.depth = depth;
        this.parent = parent;
    }
    static hash(node) {
        return `${node.x},${node.y}`;
    }
}

export default Node;
