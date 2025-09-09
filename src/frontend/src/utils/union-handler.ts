import { AssetStatus, AssetType, Rule } from "../../../declarations/backend/backend.did";
import { FormDataCreateAseet } from "../types/ui";

export function getAssetStatusText(status: AssetStatus): string {
  if ('Open' in status) return 'Open';
  if ('Inactive' in status) return 'Inactive';
  if ('Active' in status) return 'Active';
  if ('Pending' in status) return 'Pending';
  return 'Unknown';
}

export function getAssetTypeText(type: AssetType): string {
  if ('Artwork' in type) return 'Artwork';
  if ('Business' in type) return 'Business';
  if ('Vehicle' in type) return 'Vehicle';
  if ('Property' in type) return 'Property';
  if ('Equipment' in type) return 'Equipment';
  if ('Other' in type) return type.Other;
  return 'Unknown';
}

export function mapFormDataToCreateAsset(d: FormDataCreateAseet) {
    // Mapping AssetType
    let assetType: AssetType;
    switch (d.assetType) {
        case "Artwork": assetType = { Artwork: null }; break;
        case "Business": assetType = { Business: null }; break;
        case "Vehicle": assetType = { Vehicle: null }; break;
        case "Property": assetType = { Property: null }; break;
        case "Equipment": assetType = { Equipment: null }; break;
        default: assetType = { Other: d.assetType };
    }

    let assetStatus: AssetStatus;
    switch (d.assetStatus) {
        case "Open": assetStatus = { Open: null }; break;
        case "Inactive": assetStatus = { Inactive: null }; break;
        case "Active": assetStatus = { Active: null }; break;
        case "Pending": assetStatus = { Pending: null }; break;
        default: throw new Error("Invalid assetStatus: " + d.assetStatus);
    }

    return {
        name: d.name,
        description: d.description,
        totalToken: BigInt(d.totalToken),
        providedToken: BigInt(d.providedToken),
        minTokenPurchased: BigInt(d.minTokenPurchased),
        maxTokenPurchased: BigInt(d.maxTokenPurchased),
        pricePerToken: BigInt(d.pricePerToken),
        assetType,
        assetStatus,
    };
}

export function mapRule(formRule: {
    sellSharing: boolean;
    sellSharingNeedVote: boolean;
    sellSharingPrice: number;
    needDownPayment: boolean;
    minDownPaymentPercentage: number;
    downPaymentCashback: number;
    downPaymentMaturityTime: number;
    paymentMaturityTime: number;
    ownerShipMaturityTime: number;
    details: string[];
}): Rule {
    return {
        sellSharing: formRule.sellSharing,
        sellSharingNeedVote: formRule.sellSharingNeedVote,
        sellSharingPrice: BigInt(formRule.sellSharingPrice),
        needDownPayment: formRule.needDownPayment,
        minDownPaymentPercentage: formRule.minDownPaymentPercentage,
        downPaymentCashback: formRule.downPaymentCashback,
        downPaymentMaturityTime: BigInt(formRule.downPaymentMaturityTime),
        paymentMaturityTime: BigInt(formRule.paymentMaturityTime),
        ownerShipMaturityTime: BigInt(formRule.ownerShipMaturityTime),
        details: formRule.details,
    };
}
