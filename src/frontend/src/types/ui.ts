import { LucideIcon } from "lucide-react";
import React from "react";
import { DocumentHashDataType } from "./rwa";

export enum AssetTypeOptions {
  Artwork = 'Artwork',
  Business = 'Business',
  Vehicle = 'Vehicle',
  Property = 'Property',
  Other = 'Other',
  Equipment = 'Equipment',
  All = "All"
};

export enum SpecificAssetOverview {
  Overview = "Overview",
  Token = "Token",
  Dividend = "Dividend",
  AccessInfo = "Access Info",
}

export enum ShowAssetoption {
  card = 'card',
  list = 'list',
}

export interface FilterState {
  searchQuery: string;
  selectedAssetTypes: string[];
}

export interface SearchCompProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export interface AssetTypeFilterTabProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

export interface LoaderProps {
  size?: number;
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export enum UserDashboardMenus {
  AboutMe = "About Me",
  AssetsList = "Assets List",
  Proposals = "Proposals",
  CreateAsset = "Create Asset",
  MyReport = "My Reports",
  Ownership = "Ownership",
  Dividend = "Dividend",
  Transaction = "Transaction",
}

export interface UserDashboardSubMenusInterface {
  name: string;
  usermenu: UserDashboardMenus;
  icon?: LucideIcon;
}

export interface UserDashboardMenusInterface {
  name: string;
  usermenu?: UserDashboardMenus;
  icon?: LucideIcon;
  submenu: UserDashboardSubMenusInterface[];
}

export enum CreateAssetStep {
  overview = "overview", // name, description, type, status
  token = "token", // totalToken, providedToken, minTokenPurchased, maxTokenPurchased, pricePerToken
  document = "document", // documentHash
  location = "location", // documentHash
  rule = "rule", // rule
  tag = "term and agreement"
}


export type AccordionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export enum ModalKindEnum {
  adddocument = "adddocument",
  personalinfo = "personalinfo",
  addruledetails = "addruledetails",
  proposebuytoken = "proposebuytoken",
  plagiarism = "plagiarism",
  userscam = "userscam",
  hashclarity = "hashclarity",
  userfootprintflow = "userfootprintflow",
}

export interface ModalWrapperInterface {
  name: ModalKindEnum;
  component: React.ReactNode;
}

export interface ContentDashboardInterface
  extends Omit<ModalWrapperInterface, "name"> {
  name: UserDashboardMenus;
}

export interface DocumentHashInterface {
  name: string;
  description: string;
  hash: string;
}

export enum ReportCenterEnum {
  asset = 'asset',
  user = 'user'
}


export interface ContentReportCenterInterface
  extends Omit<ModalWrapperInterface, "name"> {
  name: ReportCenterEnum;
}

export type FormDataCreateAseet = {
  name: string;
  description: string;
  assetType: string;
  assetStatus: string;

  totalToken: number;
  providedToken: number;
  minTokenPurchased: number;
  maxTokenPurchased: number;
  pricePerToken: number;

  locationInfo: { lat: number; long: number; details: string[] };
  documentHash: DocumentHashDataType[];

  rule: {
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
  };

  agreement: boolean;
};
