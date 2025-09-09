import DataType "../data/dataType";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

module {
  public func validateAssetInput(
    totalToken : Nat,
    providedToken : Nat,
    minTokenPurchased : Nat,
    maxTokenPurchased : Nat,
    pricePerToken : Nat,
    rule : DataType.Rule,
    documentHash : [DataType.DocumentHash],
  ) : Result.Result<(), Text> {
    if (totalToken == 0) {
      return #err("Total token must be greater than 0.");
    };

    if (minTokenPurchased == 0 or maxTokenPurchased == 0) {
      return #err("Minimum or maximum token purchase must be greater than 0.");
    };

    if (minTokenPurchased > maxTokenPurchased) {
      return #err("Minimum token purchase cannot be greater than maximum.");
    };

    if (providedToken > totalToken) {
      return #err("Provided token cannot exceed total token.");
    };

    if (pricePerToken == 0) {
      return #err("Cannot create free token assets to avoid money laundering.");
    };

    if (not rule.sellSharing and rule.sellSharingPrice > 0) {
      return #err("Sell sharing is disabled, so price must be 0.");
    };

    if (documentHash.size() == 0) {
      return #err("You need to add at least one document hash legality or documentation.");
    };

    if (not rule.needDownPayment and rule.downPaymentCashback > 0.0) {
      return #err("No down payment required, so cashback must be 0.");
    };

    if (rule.downPaymentCashback > 1.0) {
      return #err("Cashback cannot exceed 100%.");
    };

    if (rule.paymentMaturityTime == 0) {
      return #err("Payment maturity time must be greater than 0.");
    };

    if (rule.details.size() == 0) {
      return #err("Rule details cannot be empty.");
    };

    return #ok(());
  };

  public func validateExistAssetAndExistToken(
    buyer : Principal,
    assetId : Text,
    currentAssetId : Nat,
    amount : Nat,
    assetsStorage : HashMap.HashMap<Text, DataType.Asset>,
  ) : Result.Result<(), Text> {

    let words = Text.split(assetId, #char('-'));
    let wordsArray = Iter.toArray(words);
    let arraySize = wordsArray.size();

    if (arraySize == 0) {
      return #err("Invalid asset ID format.");
    };

    let lastPart = wordsArray[arraySize - 1];

    switch (Nat.fromText(lastPart)) {
      case (null) {
        return #err("Invalid asset ID number.");
      };
      case (?assetNum) {
        if (assetNum == 0 or assetNum > currentAssetId) {
          return #err("Asset not found.");
        };

        switch (assetsStorage.get(assetId)) {
          case (null) {
            return #err("Asset not found.");
          };
          case (?asset) {
            if (asset.tokenLeft < amount) {
              return #err("No token available for this asset.");
            };

            if (asset.minTokenPurchased > amount or asset.maxTokenPurchased < amount) {
              return #err("Cannot proceed because of token minimum or maximum puchased is not suficient.");
            };

            if (asset.assetStatus != #Open) {
              return #err("This is asset token is not open for sale.");
            };

            if (asset.rule.minDownPaymentPercentage > 1.0) {
              return #err("Cannot downpayment percentage is cannot be greater than 100%.");
            };

            if (asset.creator == buyer) {
              return #err("You cannot proposed to buy your own asset as an asset creator.");
            };

            return #ok(());
          };
        };
      };
    };
  };
};
