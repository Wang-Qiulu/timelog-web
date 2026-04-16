import { addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const COLLECTION = 'timeLogs';

function getUid() {
  return auth.currentUser?.uid;
}

export async function addLog(log) {
  const uid = getUid();
  if (!uid) throw new Error('用户未登录');
  return addDoc(collection(db, 'users', uid, COLLECTION), { ...log, userId: uid });
}

export async function getLogsByDate(date) {
  const uid = getUid();
  if (!uid) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, 'users', uid, COLLECTION),
    where('endTime', '>=', startOfDay.getTime()),
    where('endTime', '<=', endOfDay.getTime()),
    orderBy('endTime', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllLogs() {
  const uid = getUid();
  if (!uid) return [];

  const q = query(collection(db, 'users', uid, COLLECTION), orderBy('endTime', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateLog(id, updates) {
  const uid = getUid();
  if (!uid) throw new Error('用户未登录');
  return updateDoc(doc(db, 'users', uid, COLLECTION, id), updates);
}

export async function deleteLog(id) {
  const uid = getUid();
  if (!uid) throw new Error('用户未登录');
  return deleteDoc(doc(db, 'users', uid, COLLECTION, id));
}