
export function wrapInPx(val) {
    return `${val}px`;
}

const dets = {
    width: window.innerWidth,
    height: window.innerHeight,
    get wpx() {
        return wrapInPx(this.width);
    },
    get hpx() {
        return wrapInPx(this.height);
    }
};
window.addEventListener('resize', function() {
    dets.width = window.innerWidth;
    dets.height = window.innerHeight;
});

export default dets;
