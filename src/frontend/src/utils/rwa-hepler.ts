import * as forge from 'node-forge';
import { IdentityNumberType, ReportType } from "../../../declarations/backend/backend.did";

export function ReduceCharacters(d: string, num: number = 20): string {
  if (d.length <= num) return d;
  return d.slice(0, num) + "....";
}

export function formatMotokoTime(nanoseconds: bigint) {
  const ms = Number(nanoseconds / 1000000n);
  return new Date(ms).toLocaleString("en-EN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
export function mapToIdentityNumberType(value: string): IdentityNumberType {
  switch (value) {
    case "IdentityNumber":
      return { IdentityNumber: null };
    case "LiscenseNumber":
      return { LiscenseNumber: null };
    case "Pasport":
      return { Pasport: null };
    default:
      throw new Error("Invalid id type");
  }
}

export function mapToReportType(value: string): ReportType {
  switch (value) {
    case "Fraud":
      return { Fraud: null };
    case "Plagiarism":
      return { Plagiarism: null };
    case "Legality":
      return { Legality: null };
    case "Bankrupting":
      return { Bankrupting: null };
    default:
      throw new Error("Invalid id type");
  }
}

export const value2BigInt = (value: string) => {
  try {
    return value && value.trim() !== '' ? BigInt(value) : BigInt(0);
  } catch (error) {
    return BigInt(0);
  }
};

export const CreatePairKey = (): [string, string] => {
  try {
    const keypair = forge.pki.rsa.generateKeyPair(2048);

    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    return [publicKeyPem, privateKeyPem];
    
  } catch (error) {
    console.error("Error generating key pair:", error);
    throw new Error("Failed to generate key pair");
  }
};

export const signDoc = (privateKeyPem: string, hashHex: string): string => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

  const md = forge.md.sha256.create();
  md.update(forge.util.hexToBytes(hashHex));

  const signature = privateKey.sign(md);
  return forge.util.encode64(signature);
};

export const verifyHash = (
  publicKeyPem: string,
  hashText: string,
  signatureBase64: string
): boolean => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

  const signature = forge.util.decode64(signatureBase64);
  console.log(publicKey.verify(hashText, signature));
  return publicKey.verify(hashText, signature);
};