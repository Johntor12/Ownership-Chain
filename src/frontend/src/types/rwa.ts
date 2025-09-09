import type { Principal } from '@dfinity/principal';
import { Report, User } from '../../../declarations/backend/backend.did';

export interface AssetDataType {
  'id': string,
  'documentHash': Array<DocumentHashDataType>,
  'creator': Principal,
  'totalToken': bigint,
  'providedToken': bigint,
  'name': string,
  'createdAt': bigint,
  'rule': RuleDataType,
  'description': string,
  'maxTokenPurchased': bigint,
  'updatedAt': bigint,
  'assetStatus': string,
  'tokenLeft': bigint,
  'assetType': string,
  'pricePerToken': bigint,
  'locationInfo': string,
  'pendingToken': bigint,
  'minTokenPurchased': bigint,
  'riskScore': number,
}

export interface DocumentHashDataType {
  'hash': string,
  'name': string,
  'description': string,
}

export interface RuleDataType {
  'downPaymentMaturityTime': bigint,
  'sellSharing': boolean,
  'sellSharingPrice': bigint,
  'sellSharingNeedVote': boolean,
  'downPaymentCashback': number,
  'details': Array<string>,
  'paymentMaturityTime': bigint,
  'minDownPaymentPercentage': number,
  'needDownPayment': boolean,
}

export interface UserOverviewResult {
  'asset': { 'token': bigint, 'total': bigint },
  'ownership': { 'token': bigint, 'total': bigint },
  'transaction': {
    'buy': bigint,
    'total': bigint,
    'dividend': bigint,
    'sell': bigint,
    'transfer': bigint,
  },
  'userIdentity': User,
}

export interface PlagiarismManagement {
  content: string;
  description: string;
  hashClarity?: string;
  footPrintFlow?: bigint;
}

export interface ReportTypeResult {
  'personal': Report[];
  'asset': Report[]
}