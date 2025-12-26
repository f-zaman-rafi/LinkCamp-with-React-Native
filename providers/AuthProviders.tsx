import React, { ReactNode, useEffect, useState, createContext } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth'; // Importing necessary functions from Firebase Authentication
import app from '../firebase/firebase.config'; // Import the Firebase app configuration

// Define the context value type
interface AuthContextType {
  user: User | null; // Store the current user
  loading: boolean; // Store the loading state during auth operations
  signUp: (email: string, password: string) => Promise<UserCredential>; // Sign-up method
  signIn: (email: string, password: string) => Promise<UserCredential>; // Sign-in method
  logOut: () => Promise<void>; // Log-out method
}

// Create the context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize Firebase authentication
const auth = getAuth(app);

// AuthProvider component - wraps the children with auth context
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Initialize user state
  const [loading, setLoading] = useState(true); // Initialize loading state

  // Sign-up function: Handles user registration
  const signUp = (email: string, password: string) => {
    setLoading(true); // Set loading to true during the auth operation
    return createUserWithEmailAndPassword(auth, email, password); // Firebase sign-up method
  };

  // Sign-in function: Handles user login
  const signIn = (email: string, password: string) => {
    setLoading(true); // Set loading to true during the auth operation
    return signInWithEmailAndPassword(auth, email, password); // Firebase sign-in method
  };

  // Log-out function: Handles user logout
  const logOut = async () => {
    setLoading(true); // Set loading to true during the log-out operation
    try {
      await signOut(auth); // Firebase sign-out method
    } finally {
      setLoading(false); // Set loading to false once the log-out is complete
    }
  };

  // useEffect to monitor authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state on login/logout
      setLoading(false); // Set loading to false after the auth state is loaded
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    // Provide the auth context to children components
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
