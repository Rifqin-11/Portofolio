/* eslint-disable react/no-unknown-property */
import { memo, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import {
  Canvas,
  createPortal,
  useFrame,
  type ThreeElements,
} from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Preload,
  useFBO,
  useGLTF,
} from "@react-three/drei";
import { easing } from "maath";

type Mode = "lens" | "bar" | "cube";

type ModeProps = {
  scale?: number;
  ior?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  roughness?: number;
  transmission?: number;
  color?: string;
  attenuationColor?: string;
  attenuationDistance?: number;
};

type FluidGlassProps = {
  mode?: Mode;
  lensProps?: ModeProps;
  barProps?: ModeProps;
  cubeProps?: ModeProps;
  className?: string;
  children?: ReactNode;
};

type MeshProps = ThreeElements["mesh"];

type ModeWrapperProps = MeshProps & {
  children?: ReactNode;
  glb: string;
  geometryKey: string;
  lockToCenter?: boolean;
  followPointer?: boolean;
  modeProps?: ModeProps;
};

const LiquidScene = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
  });

  return (
    <group ref={group}>
      {/* Vibrant background behind the glass bar */}
      <mesh position={[0, 0, -0.6]}>
        <planeGeometry args={[22, 8]} />
        <meshBasicMaterial color="#0f0a2e" transparent opacity={0.85} />
      </mesh>
      {/* Colorful glow blobs for rich refraction */}
      <mesh position={[-4.5, 0.4, -0.25]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.35} />
      </mesh>
      <mesh position={[4.4, -0.35, -0.25]}>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.45, -0.2]}>
        <circleGeometry args={[1.2, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.25} />
      </mesh>
      <mesh position={[-2, -0.5, -0.2]}>
        <circleGeometry args={[0.9, 64]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.2} />
      </mesh>
      <mesh position={[2.5, 0.15, -0.2]}>
        <circleGeometry args={[1.0, 64]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.22} />
      </mesh>
      {/* Subtle edge highlights */}
      <mesh position={[-5.5, 0, -0.15]}>
        <planeGeometry args={[0.15, 2.5]} />
        <meshBasicMaterial color="#e0e7ff" transparent opacity={0.4} />
      </mesh>
      <mesh position={[5.5, 0, -0.15]}>
        <planeGeometry args={[0.15, 2.5]} />
        <meshBasicMaterial color="#e0e7ff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToCenter = true,
  followPointer = false,
  modeProps = {},
  ...props
}: ModeWrapperProps) {
  const ref = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF(glb);
  const buffer = useFBO({ samples: 4 });
  const [scene] = useState<THREE.Scene>(() => new THREE.Scene());
  const geoSizeRef = useRef({ width: 1, height: 1 });

  useEffect(() => {
    const geo = (nodes[geometryKey] as THREE.Mesh)?.geometry;
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    geoSizeRef.current = {
      width: (box?.max.x ?? 1) - (box?.min.x ?? 0) || 1,
      height: (box?.max.y ?? 1) - (box?.min.y ?? 0) || 1,
    };
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    const destX = followPointer ? (pointer.x * v.width) / 8 : 0;
    const destY = lockToCenter
      ? 0
      : followPointer
        ? (pointer.y * v.height) / 8
        : 0;

    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (modeProps.scale == null) {
      const size = geoSizeRef.current;
      const scaleByWidth = (v.width * 0.92) / size.width;
      const scaleByHeight = (v.height * 0.78) / size.height;
      ref.current.scale.setScalar(Math.min(scaleByWidth, scaleByHeight));
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  const {
    scale,
    ior,
    thickness,
    anisotropy,
    chromaticAberration,
    roughness,
    transmission,
    color,
    attenuationColor,
    attenuationDistance,
  } = modeProps;

  return (
    <>
      {createPortal(children, scene)}
      <mesh
        ref={ref}
        scale={scale ?? 1}
        rotation-x={Math.PI / 2}
        geometry={(nodes[geometryKey] as THREE.Mesh)?.geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          transmission={transmission ?? 1}
          roughness={roughness ?? 0}
          ior={ior ?? 1.15}
          thickness={thickness ?? 10}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.05}
          color={color ?? "#ffffff"}
          attenuationColor={attenuationColor ?? "#ffffff"}
          attenuationDistance={attenuationDistance ?? 0.25}
        />
      </mesh>
    </>
  );
});

const Lens = ({
  modeProps,
  ...props
}: { modeProps?: ModeProps } & MeshProps) => (
  <ModeWrapper
    glb="/assets/3d/lens.glb"
    geometryKey="Cylinder"
    followPointer
    modeProps={modeProps}
    {...props}
  />
);

const Cube = ({
  modeProps,
  ...props
}: { modeProps?: ModeProps } & MeshProps) => (
  <ModeWrapper
    glb="/assets/3d/cube.glb"
    geometryKey="Cube"
    followPointer
    modeProps={modeProps}
    {...props}
  />
);

const Bar = ({
  modeProps,
  ...props
}: { modeProps?: ModeProps } & MeshProps) => (
  <ModeWrapper
    glb="/assets/3d/bar.glb"
    geometryKey="Cube"
    modeProps={{
      transmission: 0.55,
      roughness: 0.22,
      thickness: 5,
      ior: 1.35,
      chromaticAberration: 0.12,
      anisotropy: 0.04,
      color: "#f5f3ff",
      attenuationColor: "#c7d2fe",
      attenuationDistance: 0.5,
      ...modeProps,
    }}
    {...props}
  />
);

const FluidGlass = ({
  mode = "lens",
  lensProps = {},
  barProps = {},
  cubeProps = {},
  className,
  children,
}: FluidGlassProps) => {
  const Wrapper = mode === "bar" ? Bar : mode === "cube" ? Cube : Lens;
  const modeProps =
    mode === "bar" ? barProps : mode === "cube" ? cubeProps : lensProps;

  return (
    <div className={`fluid-glass ${className ?? ""}`}>
      <Canvas
        className="fluid-glass-canvas"
        camera={{ position: [0, 0, 20], fov: 15 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Wrapper modeProps={modeProps}>
          <LiquidScene />
        </Wrapper>
        <Preload />
      </Canvas>
      {children && <div className="fluid-glass-content">{children}</div>}
    </div>
  );
};

export default FluidGlass;

useGLTF.preload("/assets/3d/bar.glb");
