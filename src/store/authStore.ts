// src/store/authStore.ts
import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface UserProfile {
  uid: string;
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
  card?: string;
  email: string;
  role: "admin" | "user";
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

  // ================= REGISTER (USER ONLY) =================
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
      role: "user",
    });

    set({
      user: {
        uid: res.user.uid,
        name,
        surname,
        phone,
        address,
        card,
        email,
        role: "user",
      },
      loading: false,
    });
  },

  // ================= LOGIN (USER + ADMIN) =================
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;

        // 🔹 Special handling for admin account
        if (
          data.email === "kgopotsomangena42@gmail.com" &&
          data.uid === "ikej6sm6WwXnBjpZJf7lNUI5WKU2"
        ) {
          set({
            user: {
              uid: "ikej6sm6WwXnBjpZJf7lNUI5WKU2",
              email: "kgopotsomangena42@gmail.com",
              name: "Kgopotso",
              surname: "Mangena",
              role: "admin",
            },
          });
          return;
        }

        // 🔹 Regular user
        set({ user: data });
        return;
      }

      throw new Error("No profile found for this account.");
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
  },
}));