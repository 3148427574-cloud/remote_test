/** 单个动画帧：一段 CSS transform + 持续时间 */
export interface AnimationFrame {
  transform: string;
  duration: number; // ms
}

/** 一个动画片段 */
export interface AnimationClip {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
}

/** 动画控制器的运行时状态 */
export interface AnimationState {
  currentClip: string;
  currentFrame: number;
  frameTimer: number; // 当前帧已过去多少 ms
  playing: boolean;
}
