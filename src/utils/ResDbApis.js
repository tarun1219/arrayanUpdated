export const GENERATE_KEYS = `
mutation{
    generateKeys{
      publicKey,
      privateKey
    }
  }
`;

export const POST_TRANSACTION = (metadata, asset) => `mutation {
  postTransaction(data: {
  operation: "CREATE",
  amount: 100,
  signerPublicKey: "${metadata?.signerPublicKey}",
  signerPrivateKey: "${metadata?.signerPrivateKey}",
  recipientPublicKey: "${metadata?.recipientPublicKey}",
  asset: """{
    "data": ${asset},    
  }
  """
  }){
  id
  }
}`;

export const FETCH_TRANSACTION = (signerPublicKey, recipientPublicKey) => `query { 
  getFilteredTransactions(filter: {
  ownerPublicKey:"${signerPublicKey}"
  recipientPublicKey:"${recipientPublicKey}"
  }){
  asset
  }
}`;

export const FETCH_PRODUCT = (product) => `query { 
  getFilteredProductTransactions(filter: {
		product: "${product}"
  }){
    asset
  }
}`;

export const GET_TRANSACTION = (txn_id) => `query {
  getTransaction(id: "${txn_id}") {
    asset
  }
}`;

export const UPDATE_MULTIPLE_TXNS = (data) => `mutation {
  updateMultipleTransaction(data: [${data.join(",")}]){
  id
  }
}`;

export const constructTransaction = (metadata, item) => {
  console.log(item)
    const updatedAsset = {
      ...item.info,
      ByProducts: "",
      ClaimedByproducts: item.info.ByProducts,
    };

    return `{
    id: "${item.key}",
    operation: "",
    amount: 100,
    signerPublicKey: "${metadata?.signerPublicKey}",
    signerPrivateKey: "${metadata?.signerPrivateKey}",
    recipientPublicKey: "",
     asset: """{
      "data": ${JSON.stringify(updatedAsset)}
    }"""
    }`;  
}