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
  asset: {
    data: ${asset},    
  }
  }){
  id
  }
}`;

export const GET_TRANSACTION = (txn_id) => `query {
  getTransaction(id: "${txn_id}") {
    signerPublicKey
    asset
  }
}`;

export const POST_UPDATED_TRANSACTION = (data) => `mutation {
  postTransaction(data: ${data}){
  id
  }
}`;

export const constructTransaction = (metadata, item) => {
    const updatedAsset = {
      ...item.info,
      ByProducts: "",
      ClaimedByproducts: item.info.ByProducts,
    };

    return `{
    operation: "CREATE",
    amount: 100,
    signerPublicKey: "${metadata?.signerPublicKey}",
    signerPrivateKey: "${metadata?.signerPrivateKey}",
    recipientPublicKey: "${item.recipientPublicKey}",,
     asset: {
      data: ${JSON.stringify(updatedAsset).replace(/"([^"]+)":/g, '$1:').replace(/,(\s*[}\]])/g, '$1')}
    }
    }`;  
}

export const POST_SMART_CONTRACT = (metadata, asset) => `mutation {
  postTransaction(data: {
    operation: "CREATE",
    amount: 100,
    signerPublicKey: "${metadata?.signerPublicKey}",
    signerPrivateKey: "${metadata?.signerPrivateKey}",
    recipientPublicKey: "${metadata?.recipientPublicKey}",
    asset: """{
      "data": ${asset}
    }"""
  }) {
    id
  }
}`;
