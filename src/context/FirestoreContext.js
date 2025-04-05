import React from 'react';
import { firestoreDB, FieldValue } from '../auth/firebaseAuthSDK'

export const fetchMetadata = async (transactionCount, totalStats) => {
    let totalTxns = {...transactionCount}; 
    let totalCount = {...totalStats};
  
    try {
      const metadataCollection = await firestoreDB.collection("transactionMetadata").get();
      metadataCollection.forEach((doc) => {
        const data = doc.data();
        const monthName = new Date(data.year, data.month - 1).toLocaleString("default", { month: "short" });
  
        totalTxns[monthName] += data.txnCount || 0;
        totalCount["txns"] += data.txnCount || 0;
        totalCount["products"] += data.productCount || 0;
      });
  
      return { totalCount, totalTxns };
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  }
  
  export const saveTransactionsToFirestore = async (signerPublicKey, txnData, monthlyTransactionCounts) => {
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
            txnIds: FieldValue.arrayUnion(...transactionIds),
          },
          { merge: true }
        );
  
      });
  
      // Saving txns for an user
      const allTransactionIds = Object.values(txnData).flat();
      const userTransactionsRef = firestoreDB.collection('userTransactions').doc(signerPublicKey);
      batch.set(
        userTransactionsRef,
        {
          signerPublicKey,
          txnIds: FieldValue.arrayUnion(...allTransactionIds),
        },
        { merge: true }
      );
  
      // Saving metadata
      Object.entries(monthlyTransactionCounts).forEach(([yearMonth, {txnCount, products}]) => {
        const metadataRef = firestoreDB.collection('transactionMetadata').doc(yearMonth);
  
        batch.set(
          metadataRef,
          {
            year: parseInt(yearMonth.split("-")[0], 10),
            month: parseInt(yearMonth.split("-")[1], 10),
            txnCount: FieldValue.increment(txnCount),
            productCount: FieldValue.increment(products.size),
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
  
  export const fetchUserTransactionIds = async (signerKey) => {
    const docRef = firestoreDB.collection('userTransactions').doc(signerKey);
  
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        return doc.data().txnIds || [];
      } else {
        console.error("No such document!");
        return [];
      }
    } catch (error) {
      
    }
  
  };
  
  export const deleteClaimedTransactionIds = async (industry, txnIdsToRemove) => {
    const productRef = firestoreDB.collection('products').doc(industry);
    try {
      await productRef.update({
        txnIds: FieldValue.arrayRemove(...txnIdsToRemove)
      });
      console.log(`Successfully removed transaction IDs from ${industry}`);
    } catch (error) {
      console.error('Error removing transaction IDs:', error);
    }
  }

  export const saveSmartContractToFirestore = async (signerPublicKey, contractData) => {
    try {
      const smartContractRef = firestoreDB
        .collection("smartContracts")
        .doc(signerPublicKey)
        .collection("contracts");
  
      await smartContractRef.add(contractData);
      console.log("Smart contract saved successfully to Firestore.");
    } catch (error) {
      console.error("Error saving smart contract to Firestore:", error);
    }
  };