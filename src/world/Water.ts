import * as THREE from 'three';
import { WORLD_SIZE, SEA_LEVEL } from './Terrain';

/**
 * The sea.
 *
 * One large plane with the waves done in the vertex shader — three crossing
 * sine trains plus a fresnel term for the horizon sheen. No textures, no
 * reflections, no render targets: it has to stay cheap because it covers most
 * of the screen when you are gliding in.
 */

const WATER_VERT = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
varying float vWave;

void main() {
  vec3 p = position;
  // Three crossing wave trains at different scales read as open water.
  float w =
    sin(p.x * 0.013 + uTime * 0.9) * 0.55 +
    sin(p.y * 0.017 - uTime * 0.7) * 0.42 +
    sin((p.x + p.y) * 0.031 + uTime * 1.45) * 0.22;
  p.z += w;
  vWave = w;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const WATER_FRAG = /* glsl */ `
uniform vec3 uShallow;
uniform vec3 uDeep;
uniform vec3 uSunColor;
uniform vec3 uSunDir;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
varying vec3 vWorld;
varying float vWave;

void main() {
  vec3 view = normalize(cameraPosition - vWorld);
  // Grazing angles go pale and reflective, steep angles go deep.
  float fres = pow(1.0 - clamp(view.y, 0.0, 1.0), 3.0);
  vec3 col = mix(uDeep, uShallow, clamp(fres * 1.25, 0.0, 1.0));

  // Sun glitter along the wave crests.
  vec3 sun = normalize(uSunDir);
  float spec = pow(max(dot(reflect(-view, vec3(0.0, 1.0, 0.0)), sun), 0.0), 60.0);
  col += uSunColor * spec * 0.9;
  col += uSunColor * smoothstep(0.25, 0.9, vWave) * 0.06;

  float dist = length(cameraPosition - vWorld);
  float fog = smoothstep(uFogNear, uFogFar, dist);
  col = mix(col, uFogColor, fog);

  gl_FragColor = vec4(col, 0.9);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export class Water {
  readonly mesh: THREE.Mesh;
  private readonly uniforms: {
    uTime: { value: number };
    uShallow: { value: THREE.Color };
    uDeep: { value: THREE.Color };
    uSunColor: { value: THREE.Color };
    uSunDir: { value: THREE.Vector3 };
    uFogColor: { value: THREE.Color };
    uFogNear: { value: number };
    uFogFar: { value: number };
  };

  constructor() {
    this.uniforms = {
      uTime: { value: 0 },
      uShallow: { value: new THREE.Color(0x4e9aa8) },
      uDeep: { value: new THREE.Color(0x11313f) },
      uSunColor: { value: new THREE.Color(0xffd9a4) },
      uSunDir: { value: new THREE.Vector3(0.3, 0.6, 0.7) },
      uFogColor: { value: new THREE.Color(0xdcb98f) },
      uFogNear: { value: WORLD_SIZE * 0.1 },
      uFogFar: { value: WORLD_SIZE * 0.6 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: WATER_VERT,
      fragmentShader: WATER_FRAG,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    // Enough segments for the waves to be visible, few enough to be free.
    const geo = new THREE.PlaneGeometry(WORLD_SIZE * 2.2, WORLD_SIZE * 2.2, 140, 140);
    this.mesh = new THREE.Mesh(geo, material);
    this.mesh.name = 'sea';
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = SEA_LEVEL;
    this.mesh.renderOrder = 5;
    this.mesh.frustumCulled = false;
  }

  update(elapsed: number, sunDir: THREE.Vector3, sunColor: THREE.Color, fogColor: THREE.Color): void {
    this.uniforms.uTime.value = elapsed;
    this.uniforms.uSunDir.value.copy(sunDir);
    this.uniforms.uSunColor.value.copy(sunColor);
    this.uniforms.uFogColor.value.copy(fogColor);
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
