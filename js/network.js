/* NexusNetwork — shared canvas engine for the ambient hero graph
   and the full interactive portal on network.html */
(function () {
  const COLORS = {
    human: [255, 61, 122],
    machine: [0, 229, 255],
  };

  function NexusNetwork(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.interactive = !!opts.interactive;
    this.density = opts.density || 0.00012;
    this.maxLinkDist = opts.maxLinkDist || 140;
    this.mouse = { x: -9999, y: -9999, active: false };
    this.onFrame = opts.onFrame || null;

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    this.resize();
    window.addEventListener("resize", this.resize);

    if (this.interactive) {
      canvas.addEventListener("mousemove", (e) => {
        const r = canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - r.left;
        this.mouse.y = e.clientY - r.top;
        this.mouse.active = true;
      });
      canvas.addEventListener("mouseleave", () => {
        this.mouse.active = false;
      });
      canvas.addEventListener(
        "touchmove",
        (e) => {
          const r = canvas.getBoundingClientRect();
          const t = e.touches[0];
          this.mouse.x = t.clientX - r.left;
          this.mouse.y = t.clientY - r.top;
          this.mouse.active = true;
        },
        { passive: true }
      );
    }

    requestAnimationFrame(this.loop);
  }

  NexusNetwork.prototype.resize = function () {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    this.canvas.width = Math.max(1, this.w * dpr);
    this.canvas.height = Math.max(1, this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(16, Math.min(140, Math.floor(this.w * this.h * this.density)));
    this.nodes = Array.from({ length: count }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 1,
      hue: Math.random() < 0.5 ? "human" : "machine",
    }));
  };

  NexusNetwork.prototype.loop = function () {
    this.step();
    requestAnimationFrame(this.loop);
  };

  NexusNetwork.prototype.step = function () {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    for (const n of this.nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x <= 0 || n.x >= this.w) n.vx *= -1;
      if (n.y <= 0 || n.y >= this.h) n.vy *= -1;
      n.x = Math.max(0, Math.min(this.w, n.x));
      n.y = Math.max(0, Math.min(this.h, n.y));
    }

    let linkCount = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j];
        const dx = a.x - b.x,
          dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.maxLinkDist) {
          const alpha = (1 - dist / this.maxLinkDist) * 0.5;
          const ca = COLORS[a.hue],
            cb = COLORS[b.hue];
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `rgba(${ca[0]},${ca[1]},${ca[2]},${alpha})`);
          grad.addColorStop(1, `rgba(${cb[0]},${cb[1]},${cb[2]},${alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          linkCount++;
        }
      }

      if (this.interactive && this.mouse.active) {
        const dx = a.x - this.mouse.x,
          dy = a.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const reach = this.maxLinkDist * 1.6;
        if (dist < reach) {
          const alpha = (1 - dist / reach) * 0.9;
          ctx.strokeStyle = `rgba(157,78,221,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(this.mouse.x, this.mouse.y);
          ctx.stroke();
          linkCount++;
        }
      }
    }

    for (const n of this.nodes) {
      const c = COLORS[n.hue];
      ctx.beginPath();
      ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.interactive && this.mouse.active) {
      ctx.beginPath();
      ctx.fillStyle = "#9d4edd";
      ctx.arc(this.mouse.x, this.mouse.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(157,78,221,0.5)";
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, 9, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.onFrame) {
      this.onFrame({
        nodeCount: this.nodes.length,
        linkCount,
        mouseActive: this.mouse.active,
      });
    }
  };

  window.NexusNetwork = NexusNetwork;
})();
