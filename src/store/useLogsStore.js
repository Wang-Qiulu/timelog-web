import { create } from 'zustand';
import { getLogsByDate, addLog as dbAddLog, updateLog as dbUpdateLog, deleteLog as dbDeleteLog } from '../db/db.js';

export const useLogsStore = create((set, get) => ({
  logs: [],
  loading: false,

  fetchLogs: async () => {
    set({ loading: true });
    try {
      const logs = await getLogsByDate(new Date());
      set({ logs, loading: false });
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      set({ loading: false });
    }
  },

  addLog: async (log) => {
    try {
      await dbAddLog(log);
      const logs = await getLogsByDate(new Date());
      set({ logs });
    } catch (error) {
      console.error('Failed to add log:', error);
    }
  },

  updateLog: async (id, updates) => {
    try {
      await dbUpdateLog(id, updates);
      const logs = await getLogsByDate(new Date());
      set({ logs });
    } catch (error) {
      console.error('Failed to update log:', error);
    }
  },

  deleteLog: async (id) => {
    try {
      await dbDeleteLog(id);
      const logs = await getLogsByDate(new Date());
      set({ logs });
    } catch (error) {
      console.error('Failed to delete log:', error);
    }
  },
}));