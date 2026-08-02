import { useSettingsStore } from "../../stores/useSettingsStore";
import type { InteractionFrequency } from "../../stores/useSettingsStore";
import type { EmotionState } from "../emotion/engine";

const FREQ_RANGE: Record<InteractionFrequency, [number, number]> = {
  active: [3000, 6000],
  normal: [5000, 10000],
  quiet: [10000, 20000],
};

/** 根据情感值对候选动作加权，返回选中的动画名 */
function pickWeighted(emotion: EmotionState): string {
  const { energy, joy } = emotion;

  // 低精力 → 偏好休息
  if (energy < 0.15 && Math.random() < 0.6) return "sleep";
  if (energy < 0.3 && Math.random() < 0.4) return "idle";

  // 高精力 + 高快乐 → 活泼动作
  const bounceWeight = energy * joy * 10;
  const happyWeight = energy * joy * 8;
  // 中等精力 → 走动/思考
  const walkWeight = energy * 4;
  const thinkWeight = (1 - joy) * energy * 5;
  // 保底
  const idleWeight = 1;

  const total = bounceWeight + happyWeight + walkWeight + thinkWeight + idleWeight;
  let roll = Math.random() * total;

  for (const [name, w] of [
    ["bounce", bounceWeight],
    ["happy", happyWeight],
    ["walk", walkWeight],
    ["thinking", thinkWeight],
  ] as const) {
    roll -= w;
    if (roll <= 0) return name;
  }
  return "idle";
}

export function tickBehavior(
  timeSinceLastAction: number,
  emotion: EmotionState,
): string | null {
  const freq = useSettingsStore.getState().interactionFrequency;
  const [lo, hi] = FREQ_RANGE[freq];
  const interval = lo + Math.random() * (hi - lo);

  if (timeSinceLastAction < interval) return null;

  return pickWeighted(emotion);
}
