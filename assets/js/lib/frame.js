import dets from './window-size';

export const canvas = document.createElement('canvas');
document.body.appendChild(canvas)
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.width = dets.wpx;
canvas.style.height = dets.hpx;
export const ctx = canvas.getContext('2d');

const devicePixelRatio = window.devicePixelRatio || 1;
const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;

const ratio = devicePixelRatio / backingStoreRatio;

if (devicePixelRatio !== backingStoreRatio) {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    // now scale the context to counter
    // the fact that we've manually scaled
    // our c element
    ctx.scale(ratio, ratio);
}
