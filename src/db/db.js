import { openDB } from 'idb';

const DB_NAME = 'TimeLogsDB';
const DB_VERSION = 1;
const STORE_NAME = 'timeLogs';

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('startTime', 'startTime');
          store.createIndex('endTime', 'endTime');
          store.createIndex('categoryId', 'categoryId');
          store.createIndex('createdAt', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

export async function addLog(log) {
  const db = await getDB();
  return db.add(STORE_NAME, log);
}

export async function getLog(id) {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function getAllLogs() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function getLogsByDate(date) {
  const db = await getDB();
  const allLogs = await db.getAll(STORE_NAME);

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const startTimestamp = startOfDay.getTime();

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  const endTimestamp = endOfDay.getTime();

  return allLogs.filter(log => {
    return log.endTime >= startTimestamp && log.endTime <= endTimestamp;
  }).sort((a, b) => b.endTime - a.endTime);
}

export async function updateLog(id, updates) {
  const db = await getDB();
  const log = await db.get(STORE_NAME, id);
  if (!log) throw new Error('Log not found');

  const updated = { ...log, ...updates };
  return db.put(STORE_NAME, updated);
}

export async function deleteLog(id) {
  const db = await getDB();
  return db.delete(STORE_NAME, id);
}

export async function clearAllLogs() {
  const db = await getDB();
  return db.clear(STORE_NAME);
}
