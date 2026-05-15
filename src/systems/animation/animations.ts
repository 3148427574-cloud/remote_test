import type { AnimationClip } from "./types";

/**
 * MVP 动画库
 * 所有动画基于 CSS transform，不需要精灵图。
 * 后续可替换为真实帧动画。
 */
export const CLIPS: Record<string, AnimationClip> = {
  idle: {
    name: "idle",
    loop: true,
    frames: [
      { transform: "translateY(0px)", duration: 1200 },
      { transform: "translateY(-3px)", duration: 1200 },
      { transform: "translateY(0px)", duration: 1200 },
      { transform: "translateY(3px)", duration: 1200 },
    ],
  },

  happy: {
    name: "happy",
    loop: false,
    frames: [
      { transform: "translateY(0px) scale(1)", duration: 150 },
      { transform: "translateY(-8px) scale(1.15)", duration: 150 },
      { transform: "translateY(0px) scale(1)", duration: 150 },
      { transform: "translateY(-4px) scale(1.1)", duration: 150 },
      { transform: "translateY(0px) scale(1)", duration: 150 },
    ],
  },

  thinking: {
    name: "thinking",
    loop: true,
    frames: [
      { transform: "rotate(0deg)", duration: 600 },
      { transform: "rotate(-8deg)", duration: 600 },
      { transform: "rotate(0deg)", duration: 600 },
      { transform: "rotate(8deg)", duration: 600 },
    ],
  },

  sleep: {
    name: "sleep",
    loop: true,
    frames: [
      { transform: "translateY(0px) scaleY(1)", duration: 2000 },
      { transform: "translateY(2px) scaleY(0.92)", duration: 2000 },
    ],
  },

  bounce: {
    name: "bounce",
    loop: false,
    frames: [
      { transform: "translateY(0px)", duration: 80 },
      { transform: "translateY(-12px)", duration: 200 },
      { transform: "translateY(0px)", duration: 120 },
      { transform: "translateY(-4px)", duration: 100 },
      { transform: "translateY(0px)", duration: 80 },
    ],
  },
};
