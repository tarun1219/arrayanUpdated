import React, { useContext, useEffect, useState } from 'react'
import { auth, database } from '../auth/firebaseAuthSDK'
import { sendRequest } from '../utils/ResDbClient'
import { GENERATE_KEYS } from '../utils/ResDbApis'
import { set, ref, onValue } from 'firebase/database';

export const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [userKeys, setUserKeys] = useState(null);

  async function signup(email, password) {
    const response = await auth.createUserWithEmailAndPassword(email, password);
    const userId = response.user.uid;

    sendRequest(GENERATE_KEYS).then(async (res) => {
      console.log("Generated keys successfully ", res);
      const publicKey = res.data.generateKeys.publicKey;
      const privateKey = res.data.generateKeys.privateKey;
      console.log(publicKey, privateKey)
      set(ref(database, 'users/'+userId), {
        publicKey: publicKey,
        privateKey: privateKey
      })
      setUserKeys({ publicKey, privateKey });
    });
    
    return;
  }

  async function login(email, password) {
    const response = await auth.signInWithEmailAndPassword(email, password)
    console.log(response)
    const userId = response.user.uid;
    await fetchKeys(userId);
    return;
  }

  async function fetchKeys(userId) {
    const dbRef = ref(database, 'users/'+userId);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setUserKeys(data);
    });
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