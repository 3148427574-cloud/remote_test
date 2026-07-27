import { useSettingsStore } from "../../stores/useSettingsStore";
import type { InteractionFrequency } from "../../stores/useSettingsStore";

interface EmotionState {
  joy: number;
}

interface IdleActionResult {
  animation: string;
  duration: number;
}

const IDLE_ACTIONS: IdleActionResult[] = [
  { animation: "bounce", duration: 3000 },
  { animation: "happy", duration: 5000 },
  { animation: "thinking", duration: 4000 },
  { animation: "walk", duration: 4000 },
];

const FREQ_RANGE: Record<InteractionFrequency, [number, number]> = {
  active: [3000, 6000],
  normal: [5000, 10000],
  quiet: [10000, 20000],
};

export function tickBehavior(
  timeSinceLastAction: number,
  _emotion: EmotionState,
): string | null {
  const freq = useSettingsStore.getState().interactionFrequency;
  const [lo, hi] = FREQ_RANGE[freq];
  const interval = lo + Math.random() * (hi - lo);

  if (timeSinceLastAction < interval) return null;

  const action = IDLE_ACTIONS[Math.floor(Math.random() * IDLE_ACTIONS.length)];
  return action.animation;
}
