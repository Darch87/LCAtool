// Runs the wind tunnel off the main thread and streams progress, a live velocity field and the final means.
import { makeGrid, voxelize, Tunnel, schedule, K_TOP } from './lbm.js';
import { TOWER_CENTER, GRID_ROT_DEG } from './site.js';
import { extractDirection } from './windpost.js';

let stop = false;

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === 'stop') { stop = true; return; }
  if (msg.type !== 'run') return;
  stop = false;
  const { boxes, dirs, cell = 8, uTop = 0.12, facSensors } = msg;
  for (let di = 0; di < dirs.length; di++) {
    const trueDeg = dirs[di];
    const grid = makeGrid(cell);
    const solid = voxelize(grid, boxes, TOWER_CENTER, trueDeg - GRID_ROT_DEG);
    const t = new Tunnel(grid, solid, { uTop });
    const sch = schedule(grid, uTop);
    const total = sch.spinup + sch.average;
    const chunk = 25;
    let last = 0;
    while (t.step < total) {
      if (stop) { self.postMessage({ type: 'stopped' }); return; }
      const avg = t.step >= sch.spinup;
      t.run(Math.min(chunk, total - t.step), avg);
      if (!t.healthy()) { self.postMessage({ type: 'error', message: 'The flow became unstable. Try the standard resolution.' }); return; }
      const now = performance.now();
      if (now - last > 700) {
        last = now;
        const vel = t.velocity();
        self.postMessage({ type: 'progress', dir: trueDeg, di, nDirs: dirs.length, frac: t.step / total, averaging: avg, grid: { nx: grid.nx, ny: grid.ny, nz: grid.nz, cell, x0: grid.x0, y0: grid.y0 }, vel, uTop, K_TOP }, [vel.buffer]);
      }
      await new Promise((r) => setTimeout(r, 0));
    }
    const res = extractDirection(t, trueDeg, facSensors);
    self.postMessage({ type: 'direction', dir: trueDeg, di, nDirs: dirs.length, result: res }, [res.ped.buffer, res.gust.buffer, res.cp.buffer, res.vol.buffer]);
  }
  self.postMessage({ type: 'done' });
};
