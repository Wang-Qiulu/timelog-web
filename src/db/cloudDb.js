import { addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, orderBy, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useUserStore } from '../store/useUserStore';

const COLLECTION = 'timeLogs';

function getUsername() {
  return useUserStore.getState().username;
}

export async function addLog(log) {
  const username = getUsername();
  if (!username) throw new Error('用户未登录');

  return addDoc(collection(db, 'users', username, COLLECTION), {
    ...log,
    username,
    createdAt: Date.now(),
  });
}

export async function getLogsByDate(date) {
  const username = getUsername();
  if (!username) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, 'users', username, COLLECTION),
    where('endTime', '>=', startOfDay.getTime()),
    where('endTime', '<=', endOfDay.getTime()),
    orderBy('endTime', 'desc')
  );

  const snapshot = await getDocs(q);
  const logs = snapshot.docs.map(d => {
    console.log('log doc id:', d.id); // 调试
    return { id: d.id, ...d.data() };
  });
  console.log('getLogsByDate result:', logs); // 调试
  return logs;
}

export async function getAllLogs() {
  const username = getUsername();
  if (!username) return [];

  const q = query(collection(db, 'users', username, COLLECTION), orderBy('endTime', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateLog(id, updates) {
  const username = getUsername();
  if (!username) throw new Error('用户未登录');

  return updateDoc(doc(db, 'users', username, COLLECTION, id), updates);
}

export async function deleteLog(id) {
  const username = getUsername();
  if (!username) throw new Error('用户未登录');

  console.log('deleting:', `users/${username}/${COLLECTION}/${id}`);

  // 先检查文档是否存在
  const docRef = doc(db, 'users', username, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.error('文档不存在:', id);
    throw new Error('记录不存在');
  }

  await deleteDoc(docRef);
  console.log('删除成功');
}