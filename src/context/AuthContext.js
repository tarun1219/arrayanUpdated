import React, { useContext, useEffect, useState } from 'react'
import { auth, database, firestoreDB, arrayUnion } from '../auth/firebaseAuthSDK'
import { sendRequest } from '../utils/ResDbClient'
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
        const res = await sendRequest(GENERATE_KEYS);
        const { publicKey, privateKey } = res.data.generateKeys;

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

export const saveTransactionsToFirestore = async (txnData) => {
  try {
    const batch = firestoreDB.batch();

    Object.entries(txnData).forEach(([industry, transactionIds]) => {
      if (!Array.isArray(transactionIds)) {
        console.warn(`Expected transactionIds to be an array, but got ${typeof transactionIds}`);
        return;
      }

      const productRef = firestoreDB.collection('products').doc(industry);

      batch.set(
        productRef,
        {
          productName: industry,
          transactionIds: arrayUnion(...transactionIds),
        },
        { merge: true }
      );
    });

    await batch.commit();
    console.log('All transactions saved successfully to Firestore.');
  } catch (error) {
    console.error('Error saving transactions to Firestore:', error);
  }
};