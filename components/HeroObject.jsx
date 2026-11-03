"use client";

import { useEffect, useRef } from "react";

const SCREEN_IMAGE = "/projects/cenila-full.jpg"; // full-page capture, 1152 x 2880
const SCREEN_ASPECT = 16 / 10;
const IMAGE_ASPECT = 1152 / 2880;

// A 3D laptop showing a live project on its screen. The lid opens on load,
// the page scrolls inside the screen, and the laptop turns toward the cursor.
export default function HeroObject({ href, label }) {
  const ref = useRef(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
      if (disposed) return;

      const host = ref.current;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.domElement.className = "absolute inset-0";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 2.4, 9);
      camera.lookAt(0, 0.95, 0);

      const W = 4.0;
      const D = 2.7;
      const BASE_H = 0.14;
      const LID_H = 2.6;
      const LID_T = 0.08;

      const aluminum = new THREE.MeshPhysicalMaterial({
        color: 0x3a2e31,
        metalness: 0.85,
        roughness: 0.32,
        clearcoat: 0.4,
      });

      const laptop = new THREE.Group();
      scene.add(laptop);

      // base
      const base = new THREE.Mesh(new RoundedBoxGeometry(W, BASE_H, D, 4, 0.05), aluminum);
      laptop.add(base);

      // keyboard with a red backlight
      const cols = 14;
      const rows = 5;
      const keys = new THREE.InstancedMesh(
        new RoundedBoxGeometry(0.22, 0.03, 0.2, 2, 0.02),
        new THREE.MeshStandardMaterial({
          color: 0x161012,
          roughness: 0.6,
          emissive: 0xef2b3c,
          emissiveIntensity: 0.12,
        }),
        cols * rows
      );
      const m = new THREE.Matrix4();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          m.makeTranslation((c - (cols - 1) / 2) * 0.26, BASE_H / 2 + 0.012, -0.95 + r * 0.24);
          keys.setMatrixAt(r * cols + c, m);
        }
      }
      laptop.add(keys);

      const trackpad = new THREE.Mesh(
        new THREE.PlaneGeometry(1.3, 0.75),
        new THREE.MeshPhysicalMaterial({ color: 0x2c2225, metalness: 0.6, roughness: 0.25 })
      );
      trackpad.rotation.x = -Math.PI / 2;
      trackpad.position.set(0, BASE_H / 2 + 0.002, 0.82);
      laptop.add(trackpad);

      // lid hinged on the back edge of the base
      const hinge = new THREE.Group();
      hinge.position.set(0, BASE_H / 2, -D / 2 + 0.06);
      laptop.add(hinge);

      const lid = new THREE.Mesh(new RoundedBoxGeometry(W, LID_H, LID_T, 4, 0.04), aluminum);
      lid.position.y = LID_H / 2;
      hinge.add(lid);

      const bezel = new THREE.Mesh(
        new THREE.PlaneGeometry(W - 0.1, LID_H - 0.1),
        new THREE.MeshBasicMaterial({ color: 0x050304 })
      );
      bezel.position.set(0, LID_H / 2, LID_T / 2 + 0.001);
      hinge.add(bezel);

      const screenW = W - 0.32;
      const screenH = screenW / SCREEN_ASPECT;
      const texture = new THREE.TextureLoader().load(SCREEN_IMAGE);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const visible = SCREEN_ASPECT * IMAGE_ASPECT; // fraction of the page height that fits on screen
      texture.repeat.set(1, visible);
      texture.offset.y = 1 - visible;

      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(screenW, screenH),
        new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
      );
      screen.position.set(0, LID_H / 2 + 0.06, LID_T / 2 + 0.002);
      hinge.add(screen);

      // soft red glow on the "floor"
      const glowCanvas = document.createElement("canvas");
      glowCanvas.width = glowCanvas.height = 128;
      const gctx = glowCanvas.getContext("2d");
      const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(239, 43, 60, 0.55)");
      grad.addColorStop(1, "rgba(239, 43, 60, 0)");
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, 128, 128);
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 3.6),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, depthWrite: false })
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = -BASE_H / 2 - 0.01;
      laptop.add(glow);

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const key = new THREE.PointLight(0xff4455, 50, 30);
      key.position.set(4, 4, 4);
      scene.add(key);
      const rim = new THREE.PointLight(0xffffff, 35, 30);
      rim.position.set(-5, 3, -2);
      scene.add(rim);
      const screenLight = new THREE.PointLight(0x4fb3d9, 6, 6);
      screenLight.position.set(0, 1.4, 0.8);
      laptop.add(screenLight);

      const OPEN = -0.22;
      const CLOSED = Math.PI / 2 - 0.02;
      hinge.rotation.x = reduced ? OPEN : CLOSED;

      const target = { x: 0, y: 0 };
      let raf = 0;
      let onScreen = true;

      function resize() {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = w / h;
        // pull back on narrow screens so the laptop always fits
        camera.position.z = w / h < 1.2 ? 9.5 : 6.8;
        camera.updateProjectionMatrix();
      }

      function onMove(e) {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2;
        target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      }

      const clock = new THREE.Clock();
      function render() {
        const t = clock.getElapsedTime();

        // lid swings open after the hero text has revealed
        const open = Math.min(Math.max((t - 1.2) / 1.6, 0), 1);
        const eased = 1 - Math.pow(1 - open, 4);
        hinge.rotation.x = CLOSED + (OPEN - CLOSED) * eased;
        screen.material.color.setScalar(0.15 + 0.85 * eased);

        // slow scroll down the page and back up
        const p = 0.5 - 0.5 * Math.cos(Math.max(t - 3, 0) * ((Math.PI * 2) / 22));
        texture.offset.y = (1 - visible) * (1 - p);

        const scroll = Math.min(window.scrollY / window.innerHeight, 1);
        const idle = Math.sin(t * 0.5) * 0.12;
        laptop.rotation.y += (-0.35 + idle + target.x * 0.45 + scroll * 0.6 - laptop.rotation.y) * 0.05;
        laptop.rotation.x += (target.y * 0.12 - laptop.rotation.x) * 0.05;
        laptop.position.y = Math.sin(t * 0.8) * 0.06;

        renderer.render(scene, camera);
      }

      function loop() {
        if (onScreen) render();
        raf = requestAnimationFrame(loop);
      }

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
      io.observe(host);

      if (reduced) {
        texture.onUpdate = () => renderer.render(scene, camera);
        laptop.rotation.y = -0.35;
        renderer.render(scene, camera);
      } else {
        window.addEventListener("pointermove", onMove);
        loop();
      }
      host.classList.add("opacity-100");

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        scene.traverse((o) => {
          o.geometry?.dispose();
          o.material?.map?.dispose();
          o.material?.dispose();
        });
        scene.environment.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${label}, a live project`}
      className="group relative block h-[300px] opacity-0 transition-opacity duration-[1500ms] sm:h-[400px] lg:h-[460px]"
    >
      <span className="absolute top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-panel/70 px-3 py-1 font-mono text-[11px] text-muted backdrop-blur transition group-hover:border-blood group-hover:text-bone">
        <span className="text-blood">●</span> live project — {label} ↗
      </span>
    </a>
  );
}
