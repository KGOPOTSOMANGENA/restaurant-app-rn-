import { create } from "zustand";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface UserProfile {
  uid: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  card: string;
  email: string;
}

interface AuthStore {
  user: UserProfile | null;
  loading: boolean;
  register: (data: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
    address: string;
    card: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,

  register: async (data) => {
    set({ loading: true });

    const { email, password, name, surname, phone, address, card } = data;

    const res = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(res.user, { displayName: name });

    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      name,
      surname,
      phone,
      address,
      card,
      email,
    });

    set({ 
      user: { uid: res.user.uid, name, surname, phone, address, card, email },
      loading: false
    });
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const ref = doc(db, "users", res.user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        throw new Error("No profile found for this user.");
      }

      set({ user: snap.data() as UserProfile });
    } catch (error: any) {
      let message = "Login failed. Please try again.";

      if (error.code === "auth/user-not-found") {
        message = "We do not have an account for this email. Please register.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password. Please try again.";
      } else if (error.message) {
        message = error.message;
      }

      set({ user: null });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await auth.signOut();
    set({ user: null });
  }
}));