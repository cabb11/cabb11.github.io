"use client";

import { useEffect, useRef } from "react";

// Glossy red torus knot inside a slowly counter-rotating wireframe shell.
// Leans toward the cursor and spins faster as the page scrolls.
export default function HeroObject() {
  const ref = useRef(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      const host = ref.current;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.z = 10.5;

      const group = new THREE.Group();
      scene.add(group);

      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.7, 0.5, 220, 32),
        new THREE.MeshPhysicalMaterial({
          color: 0xd61f30,
          metalness: 0.55,
          roughness: 0.18,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
        })
      );
      group.add(knot);

      const shell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(3.4, 1),
        new THREE.MeshBasicMaterial({ color: 0xef2b3c, wireframe: true, transparent: true, opacity: 0.18 })
      );
      group.add(shell);

      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const key = new THREE.PointLight(0xff4455, 60, 30);
      key.position.set(4, 3, 5);
      scene.add(key);
      const rim = new THREE.PointLight(0xffffff, 40, 30);
      rim.position.set(-5, -2, 3);
      scene.add(rim);

      const target = { x: 0, y: 0 };
      let raf = 0;
      let visible = true;

      function resize() {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      function onMove(e) {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2;
        target.y = (e.clientY / window.innerHeight - 0.5) * 2;
        key.position.x = 4 + target.x * 3;
        key.position.y = 3 - target.y * 3;
      }

      const clock = new THREE.Clock();
      function render() {
        const t = clock.getElapsedTime();
        const scroll = window.scrollY / window.innerHeight;
        knot.rotation.x = t * 0.25 + scroll * 1.5;
        knot.rotation.y = t * 0.35 + scroll * 2;
        shell.rotation.x = -t * 0.1;
        shell.rotation.y = -t * 0.15 - scroll;
        group.rotation.y += (target.x * 0.5 - group.rotation.y) * 0.05;
        group.rotation.x += (target.y * 0.35 - group.rotation.x) * 0.05;
        group.position.y = Math.sin(t * 0.8) * 0.15;
        renderer.render(scene, camera);
      }

      function loop() {
        if (visible) render();
        raf = requestAnimationFrame(loop);
      }

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(host);

      if (reduced) {
        render();
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
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-[1500ms] sm:-inset-32"
    />
  );
}
