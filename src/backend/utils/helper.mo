import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import HashMap "mo:base/HashMap";

module {
  public func assetID(assetType : DataType.AssetType, id : Nat) : Text {
    let now = Time.now();
    let secs = now / 1_000;

    let typeText = switch (assetType) {
      case (#Property) "Property";
      case (#Business) "Business";
      case (#Artwork) "Artwork";
      case (#Vehicle) "Vehicle";
      case (#Equipment) "Equipment";
      case (#Other(t)) t;
    };

    return "asset-" # typeText # "-" # Int.toText(secs) # "-" # Nat.toText(id);
  };

  public func transactionID(transactionType : DataType.TransactionType, id : Nat) : Text {
    let now = Time.now();
    let secs = now / 1_000;

    let typeText = switch (transactionType) {
      case (#Buy) "Property";
      case (#Sell) "Sell";
      case (#Transfer) "Transfer";
      case (#Dividend) "Dividend";
      case (#Downpayment) "Downpayment";
      case (#Extending) "Extending";
      case (#Redeem) "Redeem";
      case (#DownpaymentCashBack) "DownpaymentCashBack";
    };

    return "tnx-" # typeText # "-" # Int.toText(secs) # "-" # Nat.toText(id);
  };

  public func ownershipID(id : Nat) : Text {
    let now = Time.now();
    let secs = now / 1_000;

    return "asset-ownership" # Int.toText(secs) # "-" # Nat.toText(id);
  };

  public func buyproposalID(id : Nat) : Text {
    let now = Time.now();
    let secs = now / 1_000;

    return "tnx-buyprop" # Int.toText(secs) # "-" # Nat.toText(id);
  };

  public func investorproposalID(id : Nat) : Text {
    let now = Time.now();
    let secs = now / 1_000;

    return "tnx-investorprop" # Int.toText(secs) # "-" # Nat.toText(id);
  };

  public func userID(id : Nat) : Text {
    let now = Time.now();
    let secs = now / 1_000;

    return "user-" # Int.toText(secs) # "-" # Nat.toText(id);
  };

  public func reportID(id : Nat, reportType : DataType.ReportType) : Text {
    let now = Time.now();
    let secs = now / 1_000;

    let typeText = switch (reportType) {
      case (#Scam) "Scam";
      case (#Fraud) "Fraud";
      case (#Legality) "Legality";
      case (#Plagiarism) "Plagiarism";
      case (#Bankrupting) "Bankrupting";
    };

    return "report-" # typeText # "-" # Int.toText(secs) # "-" # Nat.toText(id);
  };

  public func reportactionID(id : Nat, reportType : DataType.ReportActionType) : Text {
    let now = Time.now();
    let secs = now / 1_000;

    let typeText = switch (reportType) {
      case (#Freeze) "Freeze";
      case (#Pending) "Pending";
      case (#Cancled) "Cancled";
      case (#NotGuilty) "NotGuilty";
    };

    return "report-" # typeText # "-" # Int.toText(secs) # "-" # Nat.toText(id);
  };

  public func isExpired(
    createdTime : Int,
    maturityPeriod : Nat,
  ) : Bool {
    let now = Time.now();
    let expiredDownPayemntTimeNs : Nat = maturityPeriod * 24 * 60 * 60 * 1_000_000_000;

    let paymentDeadline = createdTime + expiredDownPayemntTimeNs;

    return now > paymentDeadline;
  };

  public func calculateTotalApprovalPercentage(approvals : HashMap.HashMap<Principal, Float>) : Float {
    var total : Float = 0.0;
    for ((_, percentage) in approvals.entries()) {
      total += percentage;
    };
    total;
  };
};
