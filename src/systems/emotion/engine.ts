import { useSettingsStore } from "../../stores/useSettingsStore";

/** 情感维度值，全部 [0, 1] 区间 */
export interface EmotionState {
  joy: number;
  energy: number;
  affection: number;
}

const SENSITIVITY_MULTIPLIER: Record<string, number> = {
  sensitive: 1.5,
  normal: 1.0,
  stoic: 0.5,
};

/** 触发情感变化的用户事件 */
export type EmotionEvent =
  | { type: "user_message" }
  | { type: "pet_clicked" }
  | { type: "animation_played"; animation: string };

/** 增量配置 */
interface DeltaConfig {
  joy: number;
  energy: number;
  affection: number;
}

/** 每个事件的默认增量 */
const EVENT_DELTA: Record<EmotionEvent["type"], DeltaConfig> = {
  user_message: { joy: 0.12, energy: 0.05, affection: 0.03 },
  pet_clicked: { joy: 0.06, energy: 0.08, affection: 0.01 },
  animation_played: { joy: 0, energy: 0, affection: 0 },
};

/** 动画耗能（energy 消耗量），不在此列表中的动画不耗能 */
const ANIMATION_ENERGY_COST: Record<string, number> = {
  bounce: 0.18,
  walk: 0.10,
  happy: 0.06,
  thinking: 0.03,
  idle: 0, // idle 不耗能，会缓慢恢复
  sleep: 0, // sleep 会恢复更多
};

/** 每秒衰减率：idle/sleep 状态下的自然恢复/衰减 */
const DECAY_PER_SECOND: Partial<Record<keyof EmotionState, number>> = {
  joy: 0.005, // joy 缓慢自然衰减
};

const RECOVERY_PER_SECOND: Partial<Record<keyof EmotionState, number>> = {
  energy: 0.025, // energy 在 idle 时恢复
};

const SLEEP_RECOVERY_PER_SECOND: Partial<Record<keyof EmotionState, number>> = {
  energy: 0.06, // sleep 时恢复更快
  joy: 0.008, // sleep 时轻微恢复快乐
};

const STORAGE_KEY = "aeri-emotion";
const SAVE_INTERVAL = 3000; // 每 3 秒保存一次到 localStorage

const DEFAULT_STATE: EmotionState = {
  joy: 0.5,
  energy: 0.7,
  affection: 0.1,
};

/** 从 localStorage 恢复持久化的情感值（仅 affection + joy，energy 每次启动重置） */
function loadPersisted(): Partial<EmotionState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const saved = JSON.parse(raw);
    return {
      affection: typeof saved.affection === "number" ? clamp(saved.affection) : undefined,
      joy: typeof saved.joy === "number" ? clamp(saved.joy) : undefined,
    };
  } catch {
    return {};
  }
}

function savePersisted(state: EmotionState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ joy: state.joy, affection: state.affection }),
    );
  } catch {
    // localStorage 满或不可用时静默失败
  }
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export class EmotionEngine {
  state: EmotionState;
  private pendingEvents: EmotionEvent[];
  private saveTimer: number;

  constructor(initial?: Partial<EmotionState>) {
    const persisted = loadPersisted();
    this.state = { ...DEFAULT_STATE, ...persisted, ...initial };
    this.pendingEvents = [];
    this.saveTimer = 0;
  }

  /** 推送一个事件，在当前 tick 中处理 */
  emit(event: EmotionEvent): void {
    this.pendingEvents.push(event);
  }

  /** 每 30fps tick 时调用，dt 为毫秒。currentAnimation 用于判断恢复/消耗模式。 */
  tick(dt: number, currentAnimation: string): EmotionState {
    const seconds = dt / 1000;

    // 1. 处理事件增量
    for (const event of this.pendingEvents) {
      const delta = this.resolveDelta(event);
      this.state.joy = clamp(this.state.joy + delta.joy);
      this.state.energy = clamp(this.state.energy + delta.energy);
      this.state.affection = clamp(this.state.affection + delta.affection);
    }
    this.pendingEvents = [];

    // 2. 动画消耗
    const cost = ANIMATION_ENERGY_COST[currentAnimation];
    if (cost !== undefined && cost > 0) {
      this.state.energy = clamp(this.state.energy - cost * seconds);
    }

    // 3. 自然衰减 / 恢复
    if (currentAnimation === "sleep") {
      for (const [key, rate] of Object.entries(SLEEP_RECOVERY_PER_SECOND)) {
        (this.state as any)[key] = clamp((this.state as any)[key] + rate * seconds);
      }
    } else {
      for (const [key, rate] of Object.entries(DECAY_PER_SECOND)) {
        (this.state as any)[key] = clamp((this.state as any)[key] - rate * seconds);
      }
      for (const [key, rate] of Object.entries(RECOVERY_PER_SECOND)) {
        (this.state as any)[key] = clamp((this.state as any)[key] + rate * seconds);
      }
    }

    // 4. 定期持久化
    this.saveTimer += dt;
    if (this.saveTimer >= SAVE_INTERVAL) {
      this.saveTimer = 0;
      savePersisted(this.state);
    }

    return { ...this.state };
  }

  private resolveDelta(event: EmotionEvent): DeltaConfig {
    if (event.type === "animation_played") {
      const cost = ANIMATION_ENERGY_COST[event.animation];
      if (cost !== undefined && cost > 0) {
        return { joy: 0, energy: 0, affection: 0 };
      }
    }
    const base = EVENT_DELTA[event.type];
    const sensitivity = useSettingsStore.getState().emotionSensitivity;
    const mult = SENSITIVITY_MULTIPLIER[sensitivity] ?? 1;
    return {
      joy: base.joy * mult,
      energy: base.energy * mult,
      affection: base.affection * mult,
    };
  }

  /** 将情感状态重置为默认值 */
  reset(): void {
    this.state = { ...DEFAULT_STATE };
    this.pendingEvents = [];
  }
}
