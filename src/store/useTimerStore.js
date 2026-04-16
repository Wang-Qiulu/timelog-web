import { create } from 'zustand';
import { v4 as uuidv4 } from '../utils/uuid.js';

export const useTimerStore = create((set, get) => ({
  // 计时器状态: 'idle' | 'running'
  timerState: 'idle',
  startTime: null,
  currentTime: 0,
  description: '',
  categoryId: null,

  // Actions
  start: () => {
    const startTime = Date.now();
    set({
      timerState: 'running',
      startTime,
      currentTime: 0,
    });
  },

  pause: () => {
    set({ timerState: 'idle' });
  },

  reset: () => {
    set({
      timerState: 'idle',
      startTime: null,
      currentTime: 0,
      description: '',
      categoryId: null,
    });
  },

  complete: async () => {
    const state = get();
    if (state.timerState !== 'running') return null;
    if (!state.description || !state.categoryId) return null;

    const endTime = Date.now();
    const duration = Math.round((endTime - state.startTime) / 1000 / 60 * 10) / 10; // 分钟，保留一位小数

    const log = {
      description: state.description,
      categoryId: state.categoryId,
      startTime: state.startTime,
      endTime,
      duration,
      createdAt: Date.now(),
    };

    // 重置状态
    set({
      timerState: 'idle',
      startTime: null,
      currentTime: 0,
      description: '',
      categoryId: null,
    });

    return log;
  },

  setDescription: (text) => {
    set({ description: text });
  },

  setCategory: (id) => {
    set({ categoryId: id });
  },

  tick: () => {
    const state = get();
    if (state.timerState !== 'running' || !state.startTime) return;
    set({ currentTime: Date.now() - state.startTime });
  },
}));