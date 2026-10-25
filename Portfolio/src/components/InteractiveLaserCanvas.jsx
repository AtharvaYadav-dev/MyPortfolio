import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * TRUE 3D INTERACTIVE CANVAS (THREE.JS)
 * Multi-Axis G-Code Toolpath & Hardware Visualizer
 * - Volumetric 3D toolpath for Bio4D Bioprinter & Galvo Laser
 * - Active moving extruder / laser nozzle emitting glowing particles at (X, Y, Z)
 * - Interactive mouse-drag orbit controls + scroll camera FOV zoom
 * - Real-time reactive warning strobe during thermal runaway
 */
export default function InteractiveLaserCanvas({ isThermalRunaway = false }) {
  const containerRef = useRef(null);
  const runawayRef = useRef(isThermalRunaway);

  useEffect(() => {
    runawayRef.current = isThermalRunaway;
  }, [isThermalRunaway]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 18, 38);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030712, 0.0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00f0ff, 2.5, 80);
    cyanPointLight.position.set(15, 20, 15);
    scene.add(cyanPointLight);

    const amberPointLight = new THREE.PointLight(0xff9900, 2.0, 80);
    amberPointLight.position.set(-15, 10, -15);
    scene.add(amberPointLight);

    // --- Interactive Orbit Controls (Smooth Inertia Drag) ---
    const orbit = {
      isDragging: false,
      prevX: 0,
      prevY: 0,
      targetRotX: 0.35,
      targetRotY: -0.4,
      rotX: 0.35,
      rotY: -0.4,
      targetRadius: 42,
      radius: 42,
      targetFov: 50,
    };

    const onMouseDown = (e) => {
      // Allow drag anywhere in background or while holding left mouse
      if (e.button === 0) {
        orbit.isDragging = true;
        orbit.prevX = e.clientX;
        orbit.prevY = e.clientY;
      }
    };

    const onMouseMove = (e) => {
      if (orbit.isDragging) {
        const dx = e.clientX - orbit.prevX;
        const dy = e.clientY - orbit.prevY;
        orbit.targetRotY += dx * 0.005;
        orbit.targetRotX += dy * 0.005;
        // Clamp vertical pitch to avoid flipping upside down
        orbit.targetRotX = Math.max(-0.2, Math.min(1.2, orbit.targetRotX));
        orbit.prevX = e.clientX;
        orbit.prevY = e.clientY;
      }
    };

    const onMouseUp = () => {
      orbit.isDragging = false;
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        orbit.isDragging = true;
        orbit.prevX = e.touches[0].clientX;
        orbit.prevY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (orbit.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - orbit.prevX;
        const dy = e.touches[0].clientY - orbit.prevY;
        orbit.targetRotY += dx * 0.006;
        orbit.targetRotX += dy * 0.006;
        orbit.targetRotX = Math.max(-0.2, Math.min(1.2, orbit.targetRotX));
        orbit.prevX = e.touches[0].clientX;
        orbit.prevY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      orbit.isDragging = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // --- Scroll Camera FOV / Zoom Tracking ---
    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // As user scrolls, camera smoothly zooms in/out and adjusts target FOV
      orbit.targetRadius = 42 - scrollProgress * 12;
      orbit.targetFov = 50 + Math.sin(scrollProgress * Math.PI) * 12;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- CNC Machining / Bioprinting Bed Grid ---
    const gridHelper = new THREE.GridHelper(50, 50, 0x00f0ff, 0x0a223a);
    gridHelper.position.y = -6;
    scene.add(gridHelper);

    // Axis indicators on bed
    const axisMaterialX = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    const axisGeoX = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-25, -5.9, 0),
      new THREE.Vector3(25, -5.9, 0),
    ]);
    const axisLineX = new THREE.Line(axisGeoX, axisMaterialX);
    scene.add(axisLineX);

    const axisMaterialZ = new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 });
    const axisGeoZ = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -5.9, -25),
      new THREE.Vector3(0, -5.9, 25),
    ]);
    const axisLineZ = new THREE.Line(axisGeoZ, axisMaterialZ);
    scene.add(axisLineZ);

    // --- Volumetric 3D G-Code Toolpath Generation ---
    // Represents Bio4D multi-layer spiral scaffold + Galvo vector polygonal traces
    const toolpathPoints = [];
    const layers = 5;
    const pointsPerLayer = 72;

    for (let l = 0; l < layers; l++) {
      const layerY = -5 + l * 2.5;
      for (let p = 0; p <= pointsPerLayer; p++) {
        const theta = (p / pointsPerLayer) * Math.PI * 4;
        const radius = 6 + Math.sin(theta * 2 + l) * 3 + (p / pointsPerLayer) * 4;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        toolpathPoints.push(new THREE.Vector3(x, layerY, z));
      }
      // Rapid G0 vector reposition to outer galvo square
      const outerRad = 15;
      toolpathPoints.push(new THREE.Vector3(-outerRad, layerY, -outerRad));
      toolpathPoints.push(new THREE.Vector3(outerRad, layerY, -outerRad));
      toolpathPoints.push(new THREE.Vector3(outerRad, layerY, outerRad));
      toolpathPoints.push(new THREE.Vector3(-outerRad, layerY, outerRad));
      toolpathPoints.push(new THREE.Vector3(-outerRad, layerY, -outerRad));
    }

    const toolpathCurve = new THREE.CatmullRomCurve3(toolpathPoints, true);
    const sampledPoints = toolpathCurve.getPoints(600);

    // Toolpath Line Geometry & Material
    const toolpathGeo = new THREE.BufferGeometry().setFromPoints(sampledPoints);
    const colors = [];
    for (let i = 0; i < sampledPoints.length; i++) {
      const ratio = i / sampledPoints.length;
      // Gradient from cyan to amber to emerald
      const col = new THREE.Color().setHSL(0.5 + ratio * 0.4, 0.9, 0.55);
      colors.push(col.r, col.g, col.b);
    }
    toolpathGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const toolpathMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const toolpathLine = new THREE.Line(toolpathGeo, toolpathMat);
    scene.add(toolpathLine);

    // --- Active Moving Extruder / Laser Toolhead ---
    const toolheadGroup = new THREE.Group();

    // Nozzle Cone
    const coneGeo = new THREE.ConeGeometry(0.8, 2.2, 16);
    coneGeo.rotateX(Math.PI);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.3,
    });
    const nozzleCone = new THREE.Mesh(coneGeo, coneMat);
    nozzleCone.position.y = 1.1;
    toolheadGroup.add(nozzleCone);

    // Glowing Laser Tip Sphere
    const tipGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const tipMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const nozzleTip = new THREE.Mesh(tipGeo, tipMat);
    toolheadGroup.add(nozzleTip);

    // Dynamic Vertical Laser / Gantry Guidance Beam
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 30, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 15;
    toolheadGroup.add(beamMesh);

    scene.add(toolheadGroup);

    // --- Active Particle Emitter at Active Nozzle (X, Y, Z) ---
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];
    const particleAges = new Float32Array(particleCount);
    const particleMaxAges = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = 0;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.18,
        y: (Math.random() - 0.5) * 0.18,
        z: (Math.random() - 0.5) * 0.18,
      });
      particleAges[i] = Math.random();
      particleMaxAges[i] = 0.6 + Math.random() * 0.6;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.5,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- Floating Volumetric Hardware Nodes (Ambient Dust) ---
    const ambientNodeCount = 90;
    const ambientNodeGeo = new THREE.BufferGeometry();
    const ambientNodePos = new Float32Array(ambientNodeCount * 3);

    for (let i = 0; i < ambientNodeCount * 3; i += 3) {
      ambientNodePos[i] = (Math.random() - 0.5) * 70;
      ambientNodePos[i + 1] = (Math.random() - 0.5) * 35;
      ambientNodePos[i + 2] = (Math.random() - 0.5) * 70;
    }
    ambientNodeGeo.setAttribute('position', new THREE.BufferAttribute(ambientNodePos, 3));

    const ambientNodeMat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0x1e3a8a,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const ambientNodeSystem = new THREE.Points(ambientNodeGeo, ambientNodeMat);
    scene.add(ambientNodeSystem);

    // --- Animation Loop ---
    let animId;
    let clock = new THREE.Clock();
    let pathProgress = 0;

    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const isPanic = runawayRef.current;

      // 1. Smooth Camera Orbit Dampening
      orbit.rotX += (orbit.targetRotX - orbit.rotX) * 0.06;
      orbit.rotY += (orbit.targetRotY - orbit.rotY) * 0.06;
      orbit.radius += (orbit.targetRadius - orbit.radius) * 0.06;

      // Subtle automatic idle yaw rotation when not dragging
      if (!orbit.isDragging) {
        orbit.targetRotY += 0.0015;
      }

      // Camera position from spherical coordinates
      const camY = orbit.radius * Math.sin(orbit.rotX);
      const horizontalDist = orbit.radius * Math.cos(orbit.rotX);
      const camX = horizontalDist * Math.sin(orbit.rotY);
      const camZ = horizontalDist * Math.cos(orbit.rotY);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, -1, 0);

      // FOV zoom interpolation
      camera.fov += (orbit.targetFov - camera.fov) * 0.05;
      camera.updateProjectionMatrix();

      // Camera shake during Thermal Runaway
      if (isPanic) {
        camera.position.x += (Math.random() - 0.5) * 0.6;
        camera.position.y += (Math.random() - 0.5) * 0.6;
        camera.position.z += (Math.random() - 0.5) * 0.6;
      }

      // 2. Advance Toolhead along G-Code Toolpath
      const toolheadSpeed = isPanic ? 0.09 : 0.035;
      pathProgress = (pathProgress + delta * toolheadSpeed) % 1.0;
      const nozzlePos = toolpathCurve.getPointAt(pathProgress);

      toolheadGroup.position.copy(nozzlePos);

      // Visual response on Thermal Runaway
      if (isPanic) {
        coneMat.emissive.setHex(0xef4444);
        coneMat.emissiveIntensity = 0.9 + Math.sin(elapsed * 18) * 0.4;
        beamMat.color.setHex(0xef4444);
        particleMat.color.setHex(0xff3333);
        toolpathMat.color.setHex(0xef4444);
        toolpathLine.rotation.y += 0.01;
      } else {
        coneMat.emissive.setHex(0x00f0ff);
        coneMat.emissiveIntensity = 0.4;
        beamMat.color.setHex(0x00f0ff);
        particleMat.color.setHex(0x00f0ff);
        toolpathMat.color.setHex(0xffffff);
        toolpathLine.rotation.y += 0.0008;
      }

      // 3. Update Spark Particles emitting at active nozzle coordinate (X, Y, Z)
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        particleAges[i] += delta;

        if (particleAges[i] >= particleMaxAges[i]) {
          // Respawn at nozzle position with fresh impulse
          particleAges[i] = 0;
          positions[i * 3] = nozzlePos.x;
          positions[i * 3 + 1] = nozzlePos.y;
          positions[i * 3 + 2] = nozzlePos.z;

          const spread = isPanic ? 0.35 : 0.15;
          particleVelocities[i] = {
            x: (Math.random() - 0.5) * spread,
            y: (Math.random() * 0.2 - 0.05) * spread,
            z: (Math.random() - 0.5) * spread,
          };
        } else {
          // Advance particle with slight gravity/drag
          positions[i * 3] += particleVelocities[i].x;
          positions[i * 3 + 1] += particleVelocities[i].y - 0.005;
          positions[i * 3 + 2] += particleVelocities[i].z;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Slowly rotate ambient nodes
      ambientNodeSystem.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    render();

    // --- Window Resize Handler ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);

      // Clean Three.js memory allocations
      gridHelper.geometry.dispose();
      toolpathGeo.dispose();
      toolpathMat.dispose();
      coneGeo.dispose();
      coneMat.dispose();
      tipGeo.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ambientNodeGeo.dispose();
      ambientNodeMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-auto z-0 transition-opacity duration-700"
      style={{
        opacity: isThermalRunaway ? 1 : 0.92,
        cursor: 'grab',
      }}
      title="3D Hardware Visualizer: Drag with mouse to orbit toolpath"
    />
  );
}
