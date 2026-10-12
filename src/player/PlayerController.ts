import * as THREE from 'three';
import type { Input } from '../core/Input';
import type { World } from '../world/World';
import type { Settings } from '../core/Save';
import { SEA_LEVEL, WORLD_HALF } from '../world/Terrain';
import { audio } from '../core/Audio';
import { clamp } from '../core/Noise';

/**
 * First-person movement.
 *
 * A vertical cylinder with gravity, resolved against the collision world, plus
 * a small state machine for the opening descent: you ride the Pushpaka Vimana
 * across the island, drop when you choose, fall, then glide down on a canopy.
 * That sequence exists for a reason beyond spectacle — it shows the whole map
 * and every era in it before the player has to choose where to start.
 */

export type PlayerState = 'vimana' | 'freefall' | 'glide' | 'ground' | 'swim';

const EYE_HEIGHT = 1.68;
const CROUCH_EYE = 1.02;
const RADIUS = 0.42;
const BODY_HEIGHT = 1.8;
const CROUCH_HEIGHT = 1.15;

const WALK_SPEED = 5.4;
const RUN_SPEED = 9.6;
const CROUCH_SPEED = 2.5;
const SWIM_SPEED = 3.6;
const ACCEL_GROUND = 52;
const ACCEL_AIR = 9;
const FRICTION = 11;

const GRAVITY = -22;
const JUMP_SPEED = 7.4;
const STEP_HEIGHT = 0.68;

const FREEFALL_GRAVITY = -36;
const FREEFALL_TERMINAL = -62;
const FREEFALL_STEER = 34;
const FREEFALL_MAX_HORIZONTAL = 30;

const GLIDE_DESCENT = -7.0;
const GLIDE_SPEED = 25;
const GLIDE_TURN = 1.5;

const PITCH_LIMIT = Math.PI / 2 - 0.02;

export interface VimanaRide {
  from: THREE.Vector3;
  to: THREE.Vector3;
  /** Seconds for the full crossing. */
  duration: number;
}

export class PlayerController {
  readonly position = new THREE.Vector3();
  readonly velocity = new THREE.Vector3();

  yaw = 0;
  pitch = 0;
  state: PlayerState = 'ground';

  /** Metres walked, for the report card. */
  distanceWalked = 0;
  /** Set while the glider canopy is deployed, so the HUD can show it. */
  gliderOpen = false;

  private readonly camera: THREE.PerspectiveCamera;
  private readonly world: World;
  private readonly input: Input;
  private settings: Settings;

  private crouching = false;
  private grounded = false;
  private coyote = 0;
  private bobPhase = 0;
  private bobAmount = 0;
  private stepAccumulator = 0;
  private roll = 0;
  private baseFov: number;
  private fovTarget: number;
  private landingShake = 0;
  private windCooldown = 0;

  private ride: VimanaRide | null = null;
  private rideTime = 0;
  /**
   * The click that starts the game is still in the input buffer on the first
   * frame of the ride, so ignore drop input briefly or the player is thrown out
   * of the vimana before they have seen anything.
   */
  private rideGrace = 0;
  readonly ridePosition = new THREE.Vector3();

  private readonly forwardVec = new THREE.Vector3();
  private readonly rightVec = new THREE.Vector3();
  private readonly wish = new THREE.Vector3();

  constructor(camera: THREE.PerspectiveCamera, world: World, input: Input, settings: Settings) {
    this.camera = camera;
    this.world = world;
    this.input = input;
    this.settings = settings;
    this.baseFov = camera.fov;
    this.fovTarget = camera.fov;
  }

  applySettings(settings: Settings): void {
    this.settings = settings;
    this.input.sensitivity = settings.mouseSensitivity;
    this.input.invertY = settings.invertY;
  }

  // -------------------------------------------------------------- lifecycle

  /** Put the player on the ground at a position, facing a target. */
  placeAt(position: THREE.Vector3, lookAt?: THREE.Vector3): void {
    this.position.copy(position);
    this.velocity.set(0, 0, 0);
    this.state = 'ground';
    this.gliderOpen = false;
    this.ride = null;
    if (lookAt) {
      this.yaw = PlayerController.yawTowards(lookAt.x - position.x, lookAt.z - position.z);
      this.pitch = 0;
    }
    this.syncCamera(0);
  }

  /** Begin the opening descent. */
  startRide(ride: VimanaRide): void {
    this.ride = ride;
    this.rideTime = 0;
    this.rideGrace = 2.0;
    // The mouse-down of the click that started the game is still buffered.
    this.input.endFrame();
    this.state = 'vimana';
    this.gliderOpen = false;
    this.velocity.set(0, 0, 0);
    this.ridePosition.copy(ride.from);
    this.position.copy(ride.from);
    // Face along the flight path so the island is in view from the first frame.
    const dir = ride.to.clone().sub(ride.from).normalize();
    this.yaw = PlayerController.yawTowards(dir.x, dir.z);
    this.pitch = -0.35;
    audio.conch();
    this.syncCamera(0);
  }

  /** Leave the vimana. Safe to call repeatedly; only the first one counts. */
  jumpOff(): void {
    if (this.state !== 'vimana') return;
    this.state = 'freefall';
    // Inherit the vimana's forward momentum, which is what makes the drop read.
    const ride = this.ride;
    if (ride) {
      const dir = ride.to.clone().sub(ride.from).normalize();
      const speed = ride.from.distanceTo(ride.to) / ride.duration;
      this.velocity.copy(dir).multiplyScalar(speed * 0.8);
      this.velocity.y = -2;
    }
    audio.wind(0.4);
  }

  /** Open the canopy. Ignored unless falling. */
  deployGlider(): void {
    if (this.state !== 'freefall') return;
    this.state = 'glide';
    this.gliderOpen = true;
    const horizontal = Math.hypot(this.velocity.x, this.velocity.z);
    if (horizontal < 4) {
      // Give the glider something to work with if the player dropped straight down.
      this.velocity.x = -Math.sin(this.yaw) * 8;
      this.velocity.z = -Math.cos(this.yaw) * 8;
    }
    audio.pluck(392, 0.2);
  }

  /** Fast travel: drop the player beside a discovered landing terrace. */
  teleportTo(x: number, z: number): void {
    const ground = this.world.terrain.findGround(x, z, 90);
    this.position.set(ground.x, ground.y + 0.4, ground.z);
    this.velocity.set(0, 0, 0);
    this.state = 'ground';
    this.gliderOpen = false;
    this.ride = null;
    audio.bell();
    this.syncCamera(0);
  }

  // ------------------------------------------------------------------ frame

  update(dt: number): void {
    this.look(dt);

    switch (this.state) {
      case 'vimana':
        this.updateRide(dt);
        break;
      case 'freefall':
        this.updateFreefall(dt);
        break;
      case 'glide':
        this.updateGlide(dt);
        break;
      case 'swim':
        this.updateSwim(dt);
        break;
      default:
        this.updateGround(dt);
        break;
    }

    this.syncCamera(dt);
  }

  private look(dt: number): void {
    const m = this.input.mouse;
    if (m.dx !== 0 || m.dy !== 0) {
      this.yaw -= m.dx;
      this.pitch = clamp(this.pitch - m.dy, -PITCH_LIMIT, PITCH_LIMIT);
    }
    // Keep yaw bounded so it never loses float precision over a long session.
    if (this.yaw > Math.PI) this.yaw -= Math.PI * 2;
    if (this.yaw < -Math.PI) this.yaw += Math.PI * 2;
    void dt;
  }

  /**
   * Movement basis, in three.js's convention.
   *
   * A camera with rotation.y = yaw looks down -Z, so forward is
   * (-sin yaw, 0, -cos yaw) — not (sin yaw, 0, cos yaw). Getting this backwards
   * inverts WASD and makes the scan ray probe whatever is behind you.
   */
  private basis(): void {
    this.forwardVec.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    this.rightVec.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
  }

  // ------------------------------------------------------------------- ride

  private updateRide(dt: number): void {
    const ride = this.ride;
    if (!ride) {
      this.state = 'freefall';
      return;
    }
    this.rideTime += dt;
    if (this.rideGrace > 0) this.rideGrace = Math.max(0, this.rideGrace - dt);
    const t = this.rideTime / ride.duration;
    this.ridePosition.lerpVectors(ride.from, ride.to, Math.min(1, t));
    // A gentle bank and bob, so it feels flown rather than slid.
    this.ridePosition.y += Math.sin(this.rideTime * 0.7) * 2.4;
    this.position.copy(this.ridePosition);

    if (
      this.rideGrace <= 0 &&
      (this.input.justPressed('jump') || this.input.justPressed('interact') || this.input.mouse.leftEdge)
    ) {
      this.jumpOff();
      return;
    }
    // At the end of the run the ride drops you whether you like it or not.
    if (t >= 1) this.jumpOff();
  }

  // --------------------------------------------------------------- freefall

  private updateFreefall(dt: number): void {
    this.basis();
    const axis = this.input.moveAxis();
    this.wish.set(0, 0, 0).addScaledVector(this.forwardVec, axis.z).addScaledVector(this.rightVec, axis.x);

    if (this.wish.lengthSq() > 0) {
      this.velocity.addScaledVector(this.wish.normalize(), FREEFALL_STEER * dt);
      const horizontal = Math.hypot(this.velocity.x, this.velocity.z);
      if (horizontal > FREEFALL_MAX_HORIZONTAL) {
        const k = FREEFALL_MAX_HORIZONTAL / horizontal;
        this.velocity.x *= k;
        this.velocity.z *= k;
      }
    }

    this.velocity.y = Math.max(FREEFALL_TERMINAL, this.velocity.y + FREEFALL_GRAVITY * dt);
    this.integrateAir(dt);

    this.windCooldown -= dt;
    if (this.windCooldown <= 0) {
      audio.wind(Math.min(1, Math.abs(this.velocity.y) / 60));
      this.windCooldown = 0.2;
    }

    const ground = this.world.groundAt(this.position.x, this.position.z, this.position.y);
    const altitude = this.position.y - Math.max(ground, SEA_LEVEL);

    // Manual deploy, or automatic in gentle mode — the default, because a
    // twelve-year-old should not splatter on the Great Bath.
    if (this.input.justPressed('jump') || this.input.mouse.leftEdge) {
      this.deployGlider();
      return;
    }
    if (this.settings.gentleMode && altitude < 95) {
      this.deployGlider();
      return;
    }
    if (altitude <= 0.4) this.land(ground);
  }

  private updateGlide(dt: number): void {
    const axis = this.input.moveAxis();
    // Steer by yawing; the canopy always flies where you are looking.
    this.yaw -= axis.x * GLIDE_TURN * dt;
    this.basis();

    // Pull back to slow and flatten, push forward to dive and gain speed.
    const dive = clamp(-axis.z, -1, 1);
    const descent = GLIDE_DESCENT + dive * 5.5;
    const speed = GLIDE_SPEED - dive * 7;

    this.velocity.x = this.forwardVec.x * speed;
    this.velocity.z = this.forwardVec.z * speed;
    this.velocity.y = THREE.MathUtils.lerp(this.velocity.y, descent, Math.min(1, dt * 3.2));

    this.integrateAir(dt);

    this.windCooldown -= dt;
    if (this.windCooldown <= 0) {
      audio.wind(0.35);
      this.windCooldown = 0.45;
    }

    const ground = this.world.groundAt(this.position.x, this.position.z, this.position.y);
    if (this.position.y - ground <= 0.5) this.land(ground);
    else if (this.position.y <= SEA_LEVEL + 0.6) this.enterWater();
  }

  private land(groundY: number): void {
    const impact = Math.abs(this.velocity.y);
    this.position.y = groundY;
    this.velocity.set(0, 0, 0);
    this.state = 'ground';
    this.gliderOpen = false;
    this.grounded = true;
    this.landingShake = Math.min(0.5, impact / 90);
    audio.footstep(false);
    if (impact > 14) audio.pluck(146, 0.22);
  }

  // ---------------------------------------------------------------- walking

  private updateGround(dt: number): void {
    this.basis();

    const wantCrouch = this.input.pressed('crouch');
    // Do not stand up into a ceiling.
    if (!wantCrouch && this.crouching) {
      const probe = this.world.collision.resolve(
        this.position.x,
        this.position.y,
        this.position.z,
        RADIUS,
        BODY_HEIGHT,
        STEP_HEIGHT,
      );
      this.crouching = probe.blocked ? true : false;
    } else {
      this.crouching = wantCrouch;
    }

    const sprinting = this.input.pressed('sprint') && !this.crouching;
    const maxSpeed = this.crouching ? CROUCH_SPEED : sprinting ? RUN_SPEED : WALK_SPEED;

    const axis = this.input.moveAxis();
    this.wish.set(0, 0, 0).addScaledVector(this.forwardVec, axis.z).addScaledVector(this.rightVec, axis.x);
    const moving = this.wish.lengthSq() > 0.0001;
    if (moving) this.wish.normalize();

    const accel = this.grounded ? ACCEL_GROUND : ACCEL_AIR;
    const target = this.wish.clone().multiplyScalar(maxSpeed);
    this.velocity.x = approach(this.velocity.x, target.x, accel * dt);
    this.velocity.z = approach(this.velocity.z, target.z, accel * dt);

    if (this.grounded && !moving) {
      const damp = Math.max(0, 1 - FRICTION * dt);
      this.velocity.x *= damp;
      this.velocity.z *= damp;
    }

    if (this.grounded) this.coyote = 0.12;
    else this.coyote -= dt;

    if (this.input.justPressed('jump') && this.coyote > 0) {
      this.velocity.y = JUMP_SPEED;
      this.grounded = false;
      this.coyote = 0;
      audio.footstep(true);
    }

    this.velocity.y += GRAVITY * dt;

    const before = _tmpA.copy(this.position);
    this.integrateGround(dt);
    const travelled = Math.hypot(this.position.x - before.x, this.position.z - before.z);
    this.distanceWalked += travelled;

    // Footsteps, paced by distance rather than time so sprinting sounds right.
    if (this.grounded && travelled > 0) {
      this.stepAccumulator += travelled;
      const stride = this.crouching ? 1.6 : sprinting ? 2.5 : 2.0;
      if (this.stepAccumulator >= stride) {
        this.stepAccumulator = 0;
        audio.footstep(this.crouching);
      }
    }

    // Head bob, scaled by actual speed.
    const horizontalSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    this.bobPhase += dt * (6 + horizontalSpeed * 0.9);
    this.bobAmount = THREE.MathUtils.lerp(
      this.bobAmount,
      this.grounded && this.settings.motionBlurFree ? Math.min(1, horizontalSpeed / RUN_SPEED) : 0,
      Math.min(1, dt * 6),
    );
    this.roll = THREE.MathUtils.lerp(this.roll, -axis.x * 0.022, Math.min(1, dt * 5));
    this.fovTarget = this.baseFov + (sprinting && horizontalSpeed > WALK_SPEED ? 5 : 0);

    // Did we walk into the sea?
    const groundY = this.world.groundAt(this.position.x, this.position.z, this.position.y);
    if (groundY < SEA_LEVEL - 1.0 && this.position.y < SEA_LEVEL + 0.2) this.enterWater();
  }

  private updateSwim(dt: number): void {
    this.basis();
    const axis = this.input.moveAxis();
    this.wish.set(0, 0, 0).addScaledVector(this.forwardVec, axis.z).addScaledVector(this.rightVec, axis.x);
    if (this.wish.lengthSq() > 0) this.wish.normalize();

    this.velocity.x = approach(this.velocity.x, this.wish.x * SWIM_SPEED, 14 * dt);
    this.velocity.z = approach(this.velocity.z, this.wish.z * SWIM_SPEED, 14 * dt);

    // Buoyancy holds the head at the surface; Space gives a stroke upward.
    const surface = SEA_LEVEL - 0.55;
    const rise = (surface - this.position.y) * 5.5;
    this.velocity.y = THREE.MathUtils.lerp(this.velocity.y, rise + (this.input.pressed('jump') ? 2.2 : 0), Math.min(1, dt * 5));

    this.integrateAir(dt);

    this.bobAmount = THREE.MathUtils.lerp(this.bobAmount, 0.35, Math.min(1, dt * 3));
    this.bobPhase += dt * 3.2;
    this.fovTarget = this.baseFov;

    // Climb out when the bottom comes up to meet us.
    const groundY = this.world.groundAt(this.position.x, this.position.z, this.position.y + 1);
    if (groundY > SEA_LEVEL - 0.35) {
      this.position.y = groundY;
      this.velocity.y = 0;
      this.state = 'ground';
      this.grounded = true;
    }
  }

  private enterWater(): void {
    if (this.state === 'swim') return;
    this.state = 'swim';
    this.gliderOpen = false;
    this.velocity.multiplyScalar(0.25);
    audio.splash();
  }

  // -------------------------------------------------------------- integration

  /** Airborne integration: move, resolve walls, never snap to ground. */
  private integrateAir(dt: number): void {
    this.position.addScaledVector(this.velocity, dt);
    this.clampToWorld();
    const r = this.world.collision.resolve(
      this.position.x,
      this.position.y,
      this.position.z,
      RADIUS,
      this.currentHeight(),
      0.1,
    );
    this.position.x = r.x;
    this.position.z = r.z;
  }

  /** Grounded integration: move, resolve walls, then settle onto the surface. */
  private integrateGround(dt: number): void {
    this.position.addScaledVector(this.velocity, dt);
    this.clampToWorld();

    const r = this.world.collision.resolve(
      this.position.x,
      this.position.y,
      this.position.z,
      RADIUS,
      this.currentHeight(),
      STEP_HEIGHT,
    );
    this.position.x = r.x;
    this.position.z = r.z;

    const terrainY = this.world.terrain.heightAt(this.position.x, this.position.z);
    const surface = r.supportY !== null && r.supportY > terrainY ? r.supportY : terrainY;

    if (this.position.y <= surface + 0.02) {
      // Landed, or walked up a step.
      if (this.velocity.y < -12) audio.footstep(false);
      this.position.y = surface;
      this.velocity.y = 0;
      this.grounded = true;
    } else if (this.position.y - surface < STEP_HEIGHT && this.velocity.y <= 0) {
      // Stick to the ground over small undulations instead of bouncing.
      this.position.y = surface;
      this.velocity.y = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
      // Fell off something high enough to need the glider.
      if (this.position.y - surface > 28 && !this.gliderOpen) this.state = 'freefall';
    }
  }

  private clampToWorld(): void {
    const limit = WORLD_HALF - 20;
    this.position.x = clamp(this.position.x, -limit, limit);
    this.position.z = clamp(this.position.z, -limit, limit);
    if (this.position.y > 900) this.position.y = 900;
  }

  private currentHeight(): number {
    return this.crouching ? CROUCH_HEIGHT : BODY_HEIGHT;
  }

  // ------------------------------------------------------------------ camera

  private syncCamera(dt: number): void {
    const eye = this.crouching ? CROUCH_EYE : EYE_HEIGHT;
    let y = this.position.y + eye;

    if (this.bobAmount > 0.001) {
      y += Math.sin(this.bobPhase * 2) * 0.045 * this.bobAmount;
    }
    if (this.landingShake > 0) {
      y -= this.landingShake;
      this.landingShake = Math.max(0, this.landingShake - dt * 2.2);
    }

    this.camera.position.set(this.position.x, y, this.position.z);

    const bobRoll = this.bobAmount > 0.001 ? Math.sin(this.bobPhase) * 0.012 * this.bobAmount : 0;
    this.camera.rotation.set(this.pitch, this.yaw, this.roll + bobRoll, 'YXZ');
    // 'YXZ' applies yaw then pitch then roll, which is what a head does.
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.x = this.pitch;
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.z = this.roll + bobRoll;

    if (dt > 0 && Math.abs(this.camera.fov - this.fovTarget) > 0.05) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.fovTarget, Math.min(1, dt * 6));
      this.camera.updateProjectionMatrix();
    }
  }

  /** Unit vector the camera is actually looking along. */
  getForward(out = new THREE.Vector3()): THREE.Vector3 {
    const cp = Math.cos(this.pitch);
    return out.set(-Math.sin(this.yaw) * cp, Math.sin(this.pitch), -Math.cos(this.yaw) * cp);
  }

  /** Yaw that would make the camera face the given world direction. */
  static yawTowards(dx: number, dz: number): number {
    return Math.atan2(-dx, -dz);
  }

  get eyePosition(): THREE.Vector3 {
    return this.camera.position;
  }

  get isCrouching(): boolean {
    return this.crouching;
  }

  get isAirborne(): boolean {
    return this.state === 'freefall' || this.state === 'glide' || !this.grounded;
  }

  /** Altitude above the surface below, for the HUD during a drop. */
  altitude(): number {
    const ground = this.world.groundAt(this.position.x, this.position.z, this.position.y);
    return Math.max(0, this.position.y - Math.max(ground, SEA_LEVEL));
  }

  /** 0..1 progress along the vimana flight path. */
  get rideProgress(): number {
    return this.ride ? Math.min(1, this.rideTime / this.ride.duration) : 1;
  }
}

function approach(current: number, target: number, maxDelta: number): number {
  const diff = target - current;
  if (Math.abs(diff) <= maxDelta) return target;
  return current + Math.sign(diff) * maxDelta;
}

const _tmpA = new THREE.Vector3();
