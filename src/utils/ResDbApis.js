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
