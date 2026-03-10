import { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useAdminGuard() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) { setAllowed(false); return; }
    const unsub = onSnapshot(doc(db, 'users', u.uid), snap => {
      setAllowed(snap.data()?.role === 'admin');
    });
    return unsub;
  }, []);

  return allowed;
}
