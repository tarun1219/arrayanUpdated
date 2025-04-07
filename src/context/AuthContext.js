import React, { useContext, useEffect, useState } from 'react'
import { auth, database } from '../auth/firebaseAuthSDK'
import { sendRequest, keyGenerate } from '../utils/ResDbClient'
import { GENERATE_KEYS } from '../utils/ResDbApis'
import { ref, get, set } from 'firebase/database'; 

export const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [userKeys, setUserKeys] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            fetchKeys(user.uid);
        } else {
            setUserKeys(null);
        }
        setCurrentUser(user);
        setLoading(false);
    });

    return unsubscribe;
}, []);

  async function signup(email, password) {
    const response = await auth.createUserWithEmailAndPassword(email, password);
    const userId = response.user.uid;

    try {
        const res = keyGenerate();
        const { publicKey, privateKey } = res;

        await set(ref(database, 'users/' + userId), {
            publicKey: publicKey,
            privateKey: privateKey
        });

        await fetchKeys(userId);
    } catch (error) {
        console.error("Failed to sign up and fetch keys:", error);
    }
}


async function login(email, password) {
  try {
    const response = await auth.signInWithEmailAndPassword(email, password);
    const userId = response.user.uid;
    await fetchKeys(userId);
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
}

  async function fetchKeys(userId) {
    const dbRef = ref(database, 'users/'+userId);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        setUserKeys(data);
    } else {
        setUserKeys(null); 
    }
    return;
}


  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      fetchKeys(user?.uid);
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userKeys,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}