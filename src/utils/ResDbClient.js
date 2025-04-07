import axios from 'axios';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export const sendRequest = async (query) => {
    const headers = {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Content-Type': 'application/json' 
    };
    const data = {
      query: query
    }
    // TODO: Adding the path to env
    const response = await axios.post('https://cloud.resilientdb.com/graphql', data, { headers })
    return response.data;
};

const hexToUint8Array = (hex) => {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return arr;
};

/**
 * Generates an Ed25519 key pair.
 *
 * @param {Uint8Array} [seed]
 * @returns {{ privateKey: string, publicKey: string }}
 */
export const keyGenerate = () => {
const seedHex = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
const seed = hexToUint8Array(seedHex);
  let keyPair;
  if (seed) {
    // Ensure seed is a Uint8Array of length 32
    keyPair = nacl.sign.keyPair.fromSeed(seed);
  } else {
    keyPair = nacl.sign.keyPair();
  }
  // Use only the first 32 bytes of the secretKey as the private key
  const privateKey = bs58.encode(keyPair.secretKey.slice(0, 32));
  const publicKey = bs58.encode(keyPair.publicKey);

  return { privateKey, publicKey };
};
