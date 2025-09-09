import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

module {

  // assets and it's things

  public type AssetType = {
    #Property;
    #Business;
    #Artwork;
    #Vehicle;
    #Equipment;
    #Other : Text;
  };

  public type TransactionType = {
    #Buy;
    #Sell;
    #Transfer;
    #Dividend;
    #Downpayment;
    #DownpaymentCashBack;

    // extend is used when the assets has maturity date
    // and the owner extend it
    #Extending;

    // redeem is used when the owner not extend it
    // and it's cameback to the provided assets
    #Redeem;
  };

  public type AssetStatus = {
    #Active;
    #Inactive;
    #Pending;
    #Open;
  };

  public type TransactionStatus = {
    #Completed;
    #Pending;
    #Failed;
  };

  public type DocumentHash = {
    name : Text;
    description : Text;
    hash : Text;
  };

  public type Rule = {
    sellSharing : Bool;
    sellSharingNeedVote : Bool;
    sellSharingPrice : Nat;
    needDownPayment : Bool;
    minDownPaymentPercentage : Float;
    downPaymentCashback : Float;
    downPaymentMaturityTime: Nat;

    paymentMaturityTime : Int;
    ownerShipMaturityTime : Int;
    details : [Text];
  };

  public type LocationType = {
    lat: Float;
    long: Float;
    details: [Text];
  };

  public type Asset = {
    id : Text;
    creator : Principal;
    name : Text;
    description : Text;
    totalToken : Nat;
    tokenLeft : Nat;
    providedToken : Nat;
    pendingToken : Nat;
    minTokenPurchased : Nat;
    maxTokenPurchased : Nat;
    pricePerToken : Nat;
    locationInfo : LocationType;
    documentHash : [DocumentHash];
    assetType : AssetType;
    assetStatus : AssetStatus;
    rule : Rule;
    riskScore : Float;

    createdAt : Int;
    updatedAt : Int;
  };

  public type Ownership = {
    id : Text;
    owner : Principal;
    tokenOwned : Nat;
    percentage : Float;
    purchaseDate : Int;
    purchasePrice : Nat;
    maturityDate : Int;
  };

  public type BuyProposal = {
    id : Text;
    assetId : Text;
    buyer : Principal;
    amount : Nat;
    pricePerToken : Nat;
    totalPrice : Nat;
    approvals : HashMap.HashMap<Principal, Float>;
    createdAt : Int;
    downPaymentStatus : Bool;
    downPaymentTimeStamp : Int;
  };

  public type InvestorProposal = {
    id : Text;
    assetId : Text;
    investor : Principal;
    amount : Nat;
    pricePerToken : Nat;
    totalPrice : Nat;
    approvals : HashMap.HashMap<Principal, Float>;
    createdAt : Int;
  };

  public type Transaction = {
    id : Text;
    assetId : Text;
    from : Principal;
    to : Principal;
    totalPurchasedToken : Nat;
    pricePerToken : Nat;
    totalPrice : Nat;
    transactionType : TransactionType;
    transactionStatus : TransactionStatus;
    details: ?Text;

    timestamp : Int;
  };

  // user and it's things

  public type KycStatus = {
    #Pending;
    #Verivied;
    #Rejected;
  };

  public type IdentityNumberType = {
    #IdentityNumber;
    #LiscenseNumber;
    #Pasport;
  };

  public type UserKyc = {
    status : KycStatus;
    riskScore : Nat;
  };

  public type User = {
    id : Text;
    fullName : Text;
    lastName : Text;
    phone : Text;
    country : Text;
    city : Text;
    publickey: Text;

    userIDNumber : Text;
    userIdentity : IdentityNumberType;

    kyc_level : UserKyc;
    timeStamp : Int;
  };

  // reporting and it's things

  public type AssetMetaData = {
    assetId : Text;
    documentHash : [DocumentHash];
  };

  public type ReportType = {
    #Scam;
    #Fraud;
    #Legality;
    #Plagiarism;
    #Bankrupting;
  };

  public type TypeReportEvidence = {
    hashclarity: ?Text;
    footPrintFlow: ?Int;
  };

  public type Report = {
    id: Text;
    complainer : Principal;
    targetid : Text;
    reportType : ReportType;
    content: Text;
    description: Text;
    // reputation is based on assets risk score or user kyc riskscore
    reputation : Nat;
    isDone : Int;
    isDoneTimeStamp : Int;
    evidence: ?TypeReportEvidence;

    created : Int;
  };

  public type ReportActionType = {
    #Freeze;
    #Pending;
    #Cancled;

    // not guilty is for pass the target reporting
    // may be because the target is not false or the
    // proove is not enough
    #NotGuilty;
  };

  public type ReportAction = {
    id : Text;
    reportId : Text;
    reportActionType : ReportActionType;

    created : Int;
  };

  // custom result type
  public type MyProposalResult = {
    assetId : Text;
    downPaymentStatus : Bool;
    isApprove : Bool;
    approvals : [(Principal, Float)];
  };

  public type MyVotablePoroposalResult = {
    proposalId: Text;
    assetId : Text;
    asstName: Text;
    buyer: Principal;
    tokenAmount : Nat;
    pricePerToken: Nat;
    approvalResult : Float;
    myVotePercentage: Float;
  };

  public type UserOverviewResult = {
    userIdentity: User;
    transaction: {
      total: Int;
      buy: Int;
      sell: Int;
      transfer: Int;
      dividend: Int;
    };
    ownership: {
      total: Int;
      token: Int;
    };
    asset: {
      total: Int;
      token: Int;
    }
  };

};
