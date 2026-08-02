import { create } from "zustand";
import { AnimationController } from "../systems/animation/controller";
import { EmotionEngine, type EmotionState, type EmotionEvent } from "../systems/emotion/engine";

interface PetState {
  position: { x: number; y: number };
  controller: AnimationController;
  emotionEngine: EmotionEngine;
  /** 情感快照，每 tick 更新，供 React 订阅 */
  emotion: EmotionState;
  currentTransform: string;
  currentSprite: string | undefined;
  currentAnimation: string;
  /** 当前动画已播放的 ms 数 */
  animationElapsed: number;
  /** 距上次自主动作过去了多少 ms */
  idleTimer: number;
}

interface PetActions {
  tick: (dt: number) => void;
  playAnimation: (name: string) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setIdleTimer: (t: number) => void;
  getEmotion: () => EmotionState;
  emitEmotionEvent: (event: EmotionEvent) => void;
}

export const usePetStore = create<PetState & PetActions>((set, get) => ({
  position: { x: 0, y: 0 },
  controller: new AnimationController(),
  emotionEngine: new EmotionEngine(),
  emotion: { joy: 0.5, energy: 0.7, affection: 0.1 },
  currentTransform: "",
  currentSprite: undefined,
  currentAnimation: "idle",
  animationElapsed: 0,
  idleTimer: 0,

  tick: (dt: number) => {
    const { controller, idleTimer, animationElapsed, emotionEngine } = get();
    const result = controller.tick(dt);
    const anim = controller.getState().currentClip;

    // 情感引擎每帧 tick
    emotionEngine.tick(dt, anim);

    set({
      emotion: { ...emotionEngine.state },
      currentTransform: result.transform,
      currentSprite: result.sprite,
      currentAnimation: anim,
      animationElapsed: animationElapsed + dt,
      idleTimer: idleTimer + dt,
    });
  },

  playAnimation: (name: string) => {
    get().controller.play(name);
    get().emotionEngine.emit({ type: "animation_played", animation: name });
    set({ idleTimer: 0, animationElapsed: 0 });
  },

  setPosition: (pos) => set({ position: pos }),

  setIdleTimer: (t) => set({ idleTimer: t }),

  getEmotion: () => get().emotionEngine.state,

  emitEmotionEvent: (event) => {
    get().emotionEngine.emit(event);
  },
}));
