"use strict";

window.addEventListener("load",function() {

  const step = 10;
  const side = 9;

  let colors = [];

  let canv, ctx;   // canvas and context
  let maxx, maxy;  // canvas sizes (in pixels)

  let grid;  // arrays of cells
  let xDisp,yDisp;  // pre-computed positions of cells on display

  let nbx, nby;     // grid size (in elements, not pixels)

// for animation
  let queue, animState;

  const gliders = [[[0,1,0],[0,0,1],[1,1,1]],   // 1st position
                  [[0,1,1],[1,0,1],[0,0,1]],
                  [[1,1,1],[1,0,0],[0,1,0]],
                  [[1,0,0],[1,0,1],[1,1,0]]];  // 4th position


// shortcuts for Math.…

  const mrandom = Math.random;
  const mfloor = Math.floor;
  const mround = Math.round;
  const mceil = Math.ceil;
  const mabs = Math.abs;
  const mmin = Math.min;
  const mmax = Math.max;

  const mPI = Math.PI;
  const mPIS2 = Math.PI / 2;
  const m2PI = Math.PI * 2;
  const msin = Math.sin;
  const mcos = Math.cos;
  const matan2 = Math.atan2;

  const mhypot = Math.hypot;
  const msqrt = Math.sqrt;

  const rac3   = msqrt(3);
  const rac3s2 = rac3 / 2;
  const mPIS3 = Math.PI / 3;

//-----------------------------------------------------------------------------
// miscellaneous functions
//-----------------------------------------------------------------------------

  function alea (min, max) {
// random number [min..max[ . If no max is provided, [0..min[

    if (typeof max == 'undefined') return min * mrandom();
    return min + (max - min) * mrandom();
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function intAlea (min, max) {
// random integer number [min..max[ . If no max is provided, [0..min[

    if (typeof max == 'undefined') {
      max = min; min = 0;
    }
    return mfloor(min + (max - min) * mrandom());
  } // intAlea

//-----------------------------------------------------------------------------
function drawCell (kx, ky, state) {

  ctx.fillStyle = colors[state];
  ctx.fillRect(xDisp[kx], yDisp[ky], side, side);
}

//-----------------------------------------------------------------------------

function invertedRow(row) {
  let nrow = [];
  let k, k1, len;
  for (k = 0, k1 = row.length - 1; k1 >= 0; ++k, --k1) {
    nrow[k] = row[k1];
  }
  return nrow;
}

//-----------------------------------------------------------------------------
/* one generation */

function generation() {

  let kx, ky, l0, l1, l2, h0, h2, newRow;
  let nbn; // number of neighbours
  let fstate; // future state

  let fgrid = [];

  for (let ky = 0; ky < nby; ++ky) {
    newRow = fgrid[ky] = new Array(nbx);
    newRow.fill(0);
    if (ky == 0) {
      l0 = invertedRow(grid[nby - 1]);
    } else l0 = grid[ky - 1];
    l1 = grid[ky];
    if (ky == nby - 1) {
      l2 = invertedRow(grid[0]);
    } else l2 = grid[ky + 1];

    for (let kx = 0; kx < nbx; ++kx) {
      h0 = (kx == 0) ? (nbx - 1) : kx - 1;
      h2 = (kx == nbx - 1) ? 0 : kx + 1;
      nbn = l0[h0] + l0[kx] + l0[h2] +
            l1[h0] +          l1[h2] +
            l2[h0] + l2[kx] + l2[h2];
      newRow[kx] = fstate = [[0,0,0,1,0,0,0,0,0],
                             [0,0,1,1,0,0,0,0,0]][l1[kx]][nbn];
      if (fstate != l1[kx]) drawCell(kx, ky, fstate);
    }
  } // for ky

  grid = fgrid;
}

//-----------------------------------------------------------------------------
function putCell (kx, ky) {
  grid[ky][kx] = 1;
  drawCell(kx, ky, 1);
}

//-----------------------------------------------------------------------------
function putFigure (kx, ky, figure) {

/* Not designed for putting figures on the borders of the grid
   Does nor erase previous cells
*/

  let ny = figure.length;
  let nx = figure[0].length;
  let lineg, linef;

  for (let y = 0; y < ny; ++y) {
    linef = figure[y];
    for (let x = 0; x < nx; ++x) {
      if (linef[x]) putCell(x + kx, y + ky);
    }
  }
}

//-----------------------------------------------------------------------------

function createGrid() {

  grid = [];
  for (let ky = 0; ky < nby; ++ky) {
    grid [ky] = new Array(nbx);
    grid [ky].fill(0);
  } // for ky
} // createGrid

//-----------------------------------------------------------------------------
// returns false if nothing can be done, true if drawing done

function startOver() {

  let hue, offs;

// canvas dimensions

  maxx = window.innerWidth;
  maxy = window.innerHeight;

  canv.style.left = ((window.innerWidth ) - maxx) / 2 + 'px';
  canv.style.top = ((window.innerHeight ) - maxy) / 2 + 'px';

  ctx.canvas.width = maxx;
  ctx.canvas.height = maxy;
  ctx.canvas.style.height = "100vh";
//  ctx.lineCap = 'round';   // placed here because reset when canvas resized
  ctx.imageSmoothingEnabled = false;

  nbx = mceil(maxx / step);
  nby = mceil(maxy / step);

  if (nbx < 10 || nby < 10) return false; // not interesting
  queue = [];
  hue = intAlea(0,360);
  colors = ['#000', `hsl(${hue},100%,80%)`,`hsl(${hue},100%,50%)`]

  createGrid();

// calculate positions of columns / rows
  xDisp = [];
  offs = (maxx - nbx * step) / 2 ;
  for (let kx = 0; kx < nbx; ++kx) xDisp[kx] = offs + kx * step;

  yDisp = [];
  offs = (maxy - nby * step) / 2 ;
  for (let ky = 0; ky < nby; ++ky) yDisp[ky] = offs + ky * step;

// initial population
  putFigure (mfloor(nbx / 2) , mfloor(nby / 2), gliders[intAlea(4)]);

  return true; // ok

} // startOver

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function clickCanvas(event) {
  if (event.target.tagName == 'CANVAS') {
    let ax = mfloor(event.clientX / step);
    let ay = mfloor(event.clientY / step);
    if (animState == 0) return; //  no animation, no click
    ax -= 1;
    ay -= 1;
    if (ax < 0) ax = 0;
    if (ay < 0) ay = 0;
    if (ax + 2 > nbx - 1) ax = nbx - 3;
    if (ay + 2 > nby - 1) ay = nby - 3;
    putFigure (ax,ay, gliders[intAlea(4)]);

  }

} //  clickCanvas

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function resize(event) {
  animState = 0;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function animate(tStamp) {

  let click;
  switch(animState) {
    case 0 :
      if (startOver()) ++animState;
      break;
    case 1 :
      generation();
  } // switch
  window.requestAnimationFrame(animate);

} // animate
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// beginning of execution

  {
    canv = document.createElement('canvas');
    canv.style.position="fixed";
    canv.style.backgroundColor="#000000";
    document.body.appendChild(canv);
    ctx = canv.getContext('2d');
  } // canvas creation

  window.addEventListener('click',clickCanvas);
  window.addEventListener('resize',resize);
  animState = 0; // to startOver
  animate();
}); // window load listener
