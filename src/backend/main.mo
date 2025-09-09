import DataType "data/dataType";
import HashMap "mo:base/HashMap";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Helper "utils/helper";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import Validation "utils/validation";

persistent actor {

  // data storage

  private transient var assetsStorage = HashMap.HashMap<Text, DataType.Asset>(100, Text.equal, Text.hash);
  private transient var assetCounter : Nat = 0;

  private transient var transactionsStorage = HashMap.HashMap<Text, DataType.Transaction>(100, Text.equal, Text.hash);
  private transient var transactionCounter : Nat = 0;

  private transient var ownershipsStorage = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.Ownership>>(100, Text.equal, Text.hash);
  private transient var ownershipsCounter : Nat = 0;

  private transient var usersStorage = HashMap.HashMap<Principal, DataType.User>(100, Principal.equal, Principal.hash);
  private transient var userCounter : Nat = 0;

  private transient var buyProposalsStorage = HashMap.HashMap<Text, DataType.BuyProposal>(100, Text.equal, Text.hash);
  private transient var buyProposalsCounter : Nat = 0;

  private transient var investorProposalsStorage = HashMap.HashMap<Text, DataType.InvestorProposal>(100, Text.equal, Text.hash);
  private transient var investorProposalsCounter : Nat = 0;

  private transient var assetsStorageReport = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.Report>>(100, Text.equal, Text.hash);
  private transient var assetsReportCounter : Nat = 0;

  //   private transient var assetReportStorageAction = HashMap.HashMap<Text, TrieMap.TrieMap<Text, DataType.ReportAction>>(
  //     100,
  //     Text.equal,
  //     Text.hash,
  //   );
  //   private transient var assetsReportActionCounter : Nat = 0;

  private func isUserNotBanned(user : Principal) : Bool {
    switch (usersStorage.get(user)) {
      case (?existsUser) {
        return existsUser.kyc_level.status == #Verivied;
      };
      case null {
        return false;
      };
    };
  };

  public shared (msg) func registUser(
    fullName : Text,
    lastName : Text,
    phone : Text,
    country : Text,
    city : Text,

    userIDNumber : Text,
    userIdentity : DataType.IdentityNumberType,
    publicsignature : Text,

  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;
    switch (usersStorage.get(caller)) {
      case (?_existsUser) {
        return #err("User Already Registered.");
      };
      case null {
        let now = Time.now();
        userCounter += 1;
        let id = userCounter;
        let newId = Helper.userID(id);

        let initial_kyc_user : DataType.UserKyc = {
          status = #Verivied;
          riskScore = 0;
        };

        let newUser : DataType.User = {
          id = newId;
          fullName = fullName;
          lastName = lastName;
          phone = phone;
          country = country;
          city = city;
          publickey = publicsignature;

          userIDNumber = userIDNumber;
          userIdentity = userIdentity;

          kyc_level = initial_kyc_user;
          timeStamp = now;
        };

        usersStorage.put(caller, newUser);

        return #ok(newId);
      };
    };

  };

  public shared (msg) func createAsset(
    name : Text,
    description : Text,
    totalToken : Nat,
    providedToken : Nat,
    minTokenPurchased : Nat,
    maxTokenPurchased : Nat,
    pricePerToken : Nat,
    locationInfo : DataType.LocationType,
    documentHash : [DataType.DocumentHash],
    assetType : DataType.AssetType,
    assetStatus : DataType.AssetStatus,
    rule : DataType.Rule,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return #err("You are not allowed to create asset.");
    };

    switch (
      Validation.validateAssetInput(
        totalToken,
        providedToken,
        minTokenPurchased,
        maxTokenPurchased,
        pricePerToken,
        rule,
        documentHash,
      )
    ) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };

    let now = Time.now();
    assetCounter += 1;
    let assetid = assetCounter;

    let newassetId = Helper.assetID(assetType, assetid);

    let newAsset : DataType.Asset = {
      id = newassetId;
      creator = caller;
      name = name;
      description = description;
      totalToken = totalToken;
      tokenLeft = providedToken;
      providedToken = providedToken;
      pendingToken = 0;
      minTokenPurchased = minTokenPurchased;
      maxTokenPurchased = maxTokenPurchased;
      pricePerToken = pricePerToken;
      locationInfo = locationInfo;
      documentHash = documentHash;
      assetType = assetType;
      assetStatus = assetStatus;
      rule = rule;
      riskScore = 0.0;
      createdAt = now;
      updatedAt = now;
    };

    ownershipsCounter += 1;
    let ownershipid = ownershipsCounter;
    let newownershipId = Helper.ownershipID(ownershipid);

    let ownershipMap = TrieMap.TrieMap<Principal, DataType.Ownership>(Principal.equal, Principal.hash);
    let initial_percentage : Float = Float.fromInt(totalToken - providedToken) / Float.fromInt(totalToken);
    let initial_ownership_creator : DataType.Ownership = {
      id = newownershipId;
      owner = caller;
      tokenOwned = totalToken - providedToken;
      percentage = initial_percentage;
      purchaseDate = now;
      purchasePrice = (totalToken - providedToken) * pricePerToken;
      maturityDate = 0;
    };

    assetsStorage.put(newassetId, newAsset);
    ownershipMap.put(caller, initial_ownership_creator);
    ownershipsStorage.put(newassetId, ownershipMap);
    return #ok(newassetId);

  };

  public shared (msg) func proposedBuyToken(
    assetId : Text,
    amount : Nat,
    pricePerToken : Nat,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return #err("You are not allowed to proposed to buy token asset.");
    };

    if (amount == 0) {
      return #err("There is no token you are going to purchased.");
    };

    switch (
      Validation.validateExistAssetAndExistToken(
        caller,
        assetId,
        assetCounter,
        amount,
        assetsStorage,
      )
    ) {
      case (#err(e)) return #err(e);
      case (#ok(())) {};
    };

    let now = Time.now();

    buyProposalsCounter += 1;
    let proposalId = buyProposalsCounter;
    let newBuyProposalId = Helper.buyproposalID(proposalId);

    let newApprovals = HashMap.HashMap<Principal, Float>(10, Principal.equal, Principal.hash);

    switch (assetsStorage.get(assetId)) {
      case (?existAsset) {
        switch (existAsset.rule.needDownPayment) {
          case (true) {

            let newProposal : DataType.BuyProposal = {
              id = newBuyProposalId;
              assetId = assetId;
              buyer = caller;
              amount = amount;
              pricePerToken = pricePerToken;
              totalPrice = amount * pricePerToken;
              approvals = newApprovals;
              createdAt = now;
              downPaymentStatus = false;
              downPaymentTimeStamp = 0;
            };

            buyProposalsStorage.put(newBuyProposalId, newProposal);
            return #ok("Your proposal is created, don't forget to do down payment as the asset rules.");
          };
          case (false) {
            let updatedAsset : DataType.Asset = {
              id = existAsset.id;
              creator = existAsset.creator;
              name = existAsset.name;
              description = existAsset.description;
              totalToken = existAsset.totalToken;
              tokenLeft = existAsset.tokenLeft - amount;
              providedToken = existAsset.providedToken;
              pendingToken = existAsset.pendingToken + amount;
              minTokenPurchased = existAsset.minTokenPurchased;
              maxTokenPurchased = existAsset.maxTokenPurchased;
              pricePerToken = existAsset.pricePerToken;
              locationInfo = existAsset.locationInfo;
              documentHash = existAsset.documentHash;
              assetType = existAsset.assetType;
              assetStatus = existAsset.assetStatus;
              rule = existAsset.rule;
              riskScore = existAsset.riskScore;

              createdAt = existAsset.createdAt;
              updatedAt = now;
            };

            let newProposal : DataType.BuyProposal = {
              id = newBuyProposalId;
              assetId = assetId;
              buyer = caller;
              amount = amount;
              pricePerToken = pricePerToken;
              totalPrice = amount * pricePerToken;
              approvals = newApprovals;
              createdAt = now;
              downPaymentStatus = true;
              downPaymentTimeStamp = now;
            };

            assetsStorage.put(assetId, updatedAsset);
            buyProposalsStorage.put(newBuyProposalId, newProposal);
            return #ok("Your proposal is created, waiting for the voting approval.");
          };
        };
      };
      case null {
        return #err("Asset is Not Found");
      };
    };

  };

  public shared (msg) func proceedDownPayment(
    price : Nat,
    buyProposalId : Text,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return #err("You are not allowed to proposed to buy token asset.");
    };

    let now = Time.now();

    switch (buyProposalsStorage.get(buyProposalId)) {
      case (?existProposal) {
        if (caller != existProposal.buyer) {
          return #err("You are not allowed to do downpayment for this proposal.");
        };

        switch (assetsStorage.get(existProposal.assetId)) {
          case (?proposeAsset) {
            let timeProposalCreated = existProposal.createdAt;
            let expiredDownPayemntTimeDays = proposeAsset.rule.downPaymentMaturityTime;

            if (
              Helper.isExpired(
                timeProposalCreated,
                expiredDownPayemntTimeDays,
              )
            ) {
              return #err("Sorry your payment time has passed the downpayment expire time.");
            };

            let dpFloat : Float = Float.fromInt(existProposal.totalPrice) * proposeAsset.rule.minDownPaymentPercentage;
            let dpnat : Nat = Int.abs(Float.toInt(Float.floor(dpFloat)));

            if (price != dpnat) {
              return #err("Do the downpayment as this amount, " # Nat.toText(dpnat) # ".");
            };

            let updatedAsset : DataType.Asset = {
              id = proposeAsset.id;
              creator = proposeAsset.creator;
              name = proposeAsset.name;
              description = proposeAsset.description;
              totalToken = proposeAsset.totalToken;
              tokenLeft = proposeAsset.tokenLeft - existProposal.amount;
              providedToken = proposeAsset.providedToken;
              pendingToken = proposeAsset.pendingToken + existProposal.amount;
              minTokenPurchased = proposeAsset.minTokenPurchased;
              maxTokenPurchased = proposeAsset.maxTokenPurchased;
              pricePerToken = proposeAsset.pricePerToken;
              locationInfo = proposeAsset.locationInfo;
              documentHash = proposeAsset.documentHash;
              assetType = proposeAsset.assetType;
              assetStatus = proposeAsset.assetStatus;
              rule = proposeAsset.rule;
              riskScore = proposeAsset.riskScore;

              createdAt = proposeAsset.createdAt;
              updatedAt = now;
            };

            let updatedProposal : DataType.BuyProposal = {
              id = existProposal.id;
              assetId = existProposal.assetId;
              buyer = existProposal.buyer;
              amount = existProposal.amount;
              pricePerToken = existProposal.pricePerToken;
              totalPrice = existProposal.totalPrice;
              approvals = existProposal.approvals;
              createdAt = existProposal.createdAt;
              downPaymentStatus = true;
              downPaymentTimeStamp = now;
            };

            transactionCounter += 1;
            let transactionId = transactionCounter;
            let newTransactionId : Text = Helper.transactionID(#Downpayment, transactionId);

            let createdDPTransacation : DataType.Transaction = {
              id = newTransactionId;
              assetId = proposeAsset.id;
              from = caller;
              to = proposeAsset.creator;
              totalPurchasedToken = existProposal.totalPrice;
              pricePerToken = existProposal.pricePerToken;
              totalPrice = price;
              transactionType = #Downpayment;
              transactionStatus = #Completed;
              details = null;

              timestamp = now;
            };

            transactionsStorage.put(newTransactionId, createdDPTransacation);
            buyProposalsStorage.put(existProposal.id, updatedProposal);
            assetsStorage.put(existProposal.assetId, updatedAsset);
            return #ok("Success to do downpayemnt wait for the approval");
          };
          case null {
            return #ok("Asset is not found to do downpayemnt");
          };
        };

      };
      case null {
        return #err("Proposal is not found.");
      };
    };

  };

  public shared (msg) func finishedPayment(
    proposalId : Text,
    price : Int,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return #err("You are not allowed to finished the payment.");
    };

    switch (buyProposalsStorage.get(proposalId)) {
      case (?existProposal) {

        if (existProposal.downPaymentStatus == false) {
          return #err("Finished the downpayment first.");
        };

        var totalApproval : Float = 0;
        for ((_, percent) in existProposal.approvals.entries()) {
          totalApproval += percent;
        };

        if (totalApproval <= 0.51) {
          return #err("Approval percentage is not enough. Current: " # Float.toText(totalApproval) # "%");
        };

        switch (assetsStorage.get(existProposal.assetId)) {
          case (?existAsset) {

            let dpFloat : Float = Float.fromInt(existProposal.totalPrice) * existAsset.rule.minDownPaymentPercentage;
            let dpNat : Int = Float.toInt(Float.floor(dpFloat));

            let remainingPriceleft = existProposal.totalPrice - dpNat;

            if (price != remainingPriceleft) {
              return #err("The remaining payment is " # Int.toText(remainingPriceleft));
            };

            let now = Time.now();

            let updatedAsset : DataType.Asset = {
              id = existAsset.id;
              creator = existAsset.creator;
              name = existAsset.name;
              description = existAsset.description;
              totalToken = existAsset.totalToken;
              // remain the same because the token left is already subs when the dp is done
              tokenLeft = existAsset.tokenLeft;
              providedToken = existAsset.providedToken;
              pendingToken = existAsset.pendingToken - existProposal.amount;
              minTokenPurchased = existAsset.minTokenPurchased;
              maxTokenPurchased = existAsset.maxTokenPurchased;
              pricePerToken = existAsset.pricePerToken;
              locationInfo = existAsset.locationInfo;
              documentHash = existAsset.documentHash;
              assetType = existAsset.assetType;
              assetStatus = existAsset.assetStatus;
              rule = existAsset.rule;
              riskScore = existAsset.riskScore;

              createdAt = existAsset.createdAt;
              updatedAt = now;
            };

            ownershipsCounter += 1;
            let ownershipid = ownershipsCounter;
            let newownershipId = Helper.ownershipID(ownershipid);

            let percentage : Float = Float.fromInt(existProposal.amount) / Float.fromInt(existAsset.totalToken);

            var ownershipMaturityTime : Int = 0;
            if (existAsset.rule.paymentMaturityTime > 0) {
              ownershipMaturityTime := now + existAsset.rule.ownerShipMaturityTime * 1_000_000_000 * 60 * 60 * 24;
            };

            let createdOwnership : DataType.Ownership = {
              id = newownershipId;
              owner = caller;
              tokenOwned = existProposal.amount;
              percentage = percentage;
              purchaseDate = now;
              purchasePrice = Int.abs(remainingPriceleft + dpNat);
              maturityDate = ownershipMaturityTime;
            };

            transactionCounter += 1;
            let currentTransactionId = transactionCounter;
            let newcurrentTransactionId : Text = Helper.transactionID(#Buy, currentTransactionId);

            let createdTransaction : DataType.Transaction = {
              id = newcurrentTransactionId;
              assetId = existAsset.id;
              from = existAsset.creator;
              to = caller;
              totalPurchasedToken = existProposal.amount;
              pricePerToken = existProposal.totalPrice;
              totalPrice = Int.abs(remainingPriceleft);
              transactionType = #Buy;
              transactionStatus = #Completed;
              details = null;

              timestamp = now;
            };

            switch (ownershipsStorage.get(existAsset.id)) {
              case (?existingMap) {
                existingMap.put(caller, createdOwnership);
                ownershipsStorage.put(existAsset.id, existingMap);
              };
              case (null) {
                let newMap = TrieMap.TrieMap<Principal, DataType.Ownership>(Principal.equal, Principal.hash);
                newMap.put(caller, createdOwnership);
                ownershipsStorage.put(existAsset.id, newMap);
              };
            };

            transactionsStorage.put(newcurrentTransactionId, createdTransaction);
            assetsStorage.put(existAsset.id, updatedAsset);
            return #ok("Success to get the token.");

          };
          case (null) {
            return #ok("Success to get the token.");

          };
        };
      };
      case (null) {
        return #err("Proposal is not found.");
      };
    };

  };

  public shared (msg) func approveBuyProposal(
    buyProposalId : Text
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    switch (buyProposalsStorage.get(buyProposalId)) {
      case (?existProposal) {

        if (existProposal.downPaymentStatus == false) {
          return #err("The downpayment is not done yet.");
        };

        switch (ownershipsStorage.get(existProposal.assetId)) {
          case (?ownershipMap) {
            switch (ownershipMap.get(caller)) {
              case (?ownership) {

                if (existProposal.approvals.get(caller) != null) {
                  return #err("You have already approved this proposal.");
                };

                var percentage : Float = ownership.percentage;

                switch (assetsStorage.get(existProposal.assetId)) {
                  case (?existAsset) {
                    let calculatedAssetHolderCapability : Float = Float.fromInt(existAsset.tokenLeft) / Float.fromInt(existAsset.totalToken);
                    if (calculatedAssetHolderCapability < 0.51) {
                      percentage := 1.0;
                    };
                  };
                  case null {};
                };

                existProposal.approvals.put(caller, percentage);
                buyProposalsStorage.put(buyProposalId, existProposal);

                return #ok("Successfully approved with " # Float.toText(percentage) # "% ownership.");
              };
              case null {
                return #err("You do not own any token of this asset.");
              };
            };
          };
          case null {
            return #err("No ownership data found for this asset.");
          };
        };
      };
      case null {
        return #err("Buy proposal not found.");
      };
    };
  };

  public shared (msg) func createIvestorProposal(
    assetId : Text,
    incomingInvestor : Principal,
    amount : Nat,
    pricePerToken : Nat,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;
    switch (assetsStorage.get(assetId)) {
      case (?asset) {
        if (asset.assetStatus != #Active) {
          return #err("Asset is in not active status.");
        };

        if (asset.tokenLeft < amount) {
          return #err("There is no token left in this asset.");
        };

        switch (ownershipsStorage.get(assetId)) {
          case (?ownership) {
            switch (ownership.get(caller)) {
              case (?_userOwnership) {
                let now = Time.now();
                let newapprovals = HashMap.HashMap<Principal, Float>(10, Principal.equal, Principal.hash);

                investorProposalsCounter += 1;
                let newinvestorProposalCounter = investorProposalsCounter;
                let newinvestorProposalCounterId : Text = Helper.investorproposalID(newinvestorProposalCounter);

                let createNewInsestorProposal : DataType.InvestorProposal = {
                  id = newinvestorProposalCounterId;
                  assetId = asset.id;
                  investor = incomingInvestor;
                  amount = amount;
                  pricePerToken = pricePerToken;
                  totalPrice = pricePerToken * amount;
                  approvals = newapprovals;
                  createdAt = now;
                };

                let updatedAsset : DataType.Asset = {
                  id = asset.id;
                  creator = asset.creator;
                  name = asset.name;
                  description = asset.description;
                  totalToken = asset.totalToken;
                  tokenLeft = asset.tokenLeft;
                  providedToken = asset.providedToken;
                  pendingToken = asset.pendingToken - amount;
                  minTokenPurchased = asset.minTokenPurchased;
                  maxTokenPurchased = asset.maxTokenPurchased;
                  pricePerToken = asset.pricePerToken;
                  locationInfo = asset.locationInfo;
                  documentHash = asset.documentHash;
                  assetType = asset.assetType;
                  assetStatus = asset.assetStatus;
                  rule = asset.rule;
                  riskScore = asset.riskScore;

                  createdAt = asset.createdAt;
                  updatedAt = now;
                };

                assetsStorage.put(asset.id, updatedAsset);
                investorProposalsStorage.put(newinvestorProposalCounterId, createNewInsestorProposal);
                return #ok("Successfully create proposal, wait for the ownership approval.");
              };
              case null {
                return #err("Asset is not found.");

              };
            };
          };
          case (null) {
            return #err("You have no ownership in this asset.");

          };
        };
      };
      case null {
        return #err("Asset is not found.");
      };
    };
  };

  public shared (msg) func approveInvestorProposal(
    investorProposalId : Text
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;
    switch (investorProposalsStorage.get(investorProposalId)) {
      case (?invsetorProposal) {
        switch (ownershipsStorage.get(invsetorProposal.assetId)) {
          case (?ownershipMap) {
            switch (ownershipMap.get(caller)) {
              case (?ownership) {

                if (invsetorProposal.approvals.get(caller) != null) {
                  return #err("You have already approved this proposal.");
                };

                let percentage : Float = ownership.percentage;
                invsetorProposal.approvals.put(caller, percentage);
                investorProposalsStorage.put(investorProposalId, invsetorProposal);

                return #ok("Successfully approved with " # Float.toText(percentage) # "% ownership.");
              };
              case null {
                return #err("You do not own any token of this asset.");
              };
            };
          };
          case null {
            return #err("No ownership data found for this asset.");
          };
        };
        return #err("There is no investor proposal found.");
      };
      case null {
        return #err("There is no investor proposal found.");
      };
    };
  };

  public shared (msg) func finishTheInvitation(
    investorProposalId : Text,
    price : Nat,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return #err("You are not allowed to finished the payment.");
    };

    switch (investorProposalsStorage.get(investorProposalId)) {
      case (?invitation) {
        switch (invitation.investor == caller) {
          case (true) {
            if (invitation.totalPrice != price) {
              return #err("The price you are withdraw is not sufficient.");
            };

            switch (assetsStorage.get(invitation.assetId)) {
              case (?asset) {
                let now = Time.now();
                transactionCounter += 1;
                let currentTransactionId = transactionCounter;
                let newcurrentTransactionId : Text = Helper.transactionID(#Buy, currentTransactionId);

                let createdTransaction : DataType.Transaction = {
                  id = newcurrentTransactionId;
                  assetId = invitation.assetId;
                  from = asset.creator;
                  to = caller;
                  totalPurchasedToken = invitation.amount;
                  pricePerToken = invitation.pricePerToken;
                  totalPrice = price;
                  transactionType = #Buy;
                  transactionStatus = #Completed;
                  details = null;

                  timestamp = now;
                };

                ownershipsCounter += 1;
                let ownershipid = ownershipsCounter;
                let newownershipId = Helper.ownershipID(ownershipid);

                let percentage : Float = Float.fromInt(invitation.amount) / Float.fromInt(asset.totalToken);

                let createdOwnerShip : DataType.Ownership = {
                  id = newownershipId;
                  owner = caller;
                  tokenOwned = invitation.amount;
                  percentage = percentage;
                  purchaseDate = now;
                  purchasePrice = invitation.totalPrice;
                  maturityDate = asset.rule.paymentMaturityTime;
                };

                let updatedAsset : DataType.Asset = {
                  id = asset.id;
                  creator = asset.creator;
                  name = asset.name;
                  description = asset.description;
                  totalToken = asset.totalToken;
                  tokenLeft = asset.tokenLeft - invitation.amount;
                  providedToken = asset.providedToken;
                  pendingToken = asset.pendingToken + invitation.amount;
                  minTokenPurchased = asset.minTokenPurchased;
                  maxTokenPurchased = asset.maxTokenPurchased;
                  pricePerToken = asset.pricePerToken;
                  locationInfo = asset.locationInfo;
                  documentHash = asset.documentHash;
                  assetType = asset.assetType;
                  assetStatus = asset.assetStatus;
                  rule = asset.rule;
                  riskScore = asset.riskScore;

                  createdAt = asset.createdAt;
                  updatedAt = now;
                };

                switch (ownershipsStorage.get(asset.id)) {
                  case (?existingMap) {
                    existingMap.put(caller, createdOwnerShip);
                    ownershipsStorage.put(asset.id, existingMap);
                  };
                  case (null) {
                    let newMap = TrieMap.TrieMap<Principal, DataType.Ownership>(Principal.equal, Principal.hash);
                    newMap.put(caller, createdOwnerShip);
                    ownershipsStorage.put(asset.id, newMap);
                  };
                };

                transactionsStorage.put(newcurrentTransactionId, createdTransaction);
                assetsStorage.put(asset.id, updatedAsset);

                return #ok("Accepted the invitation.");
              };
              case (null) {
                return #err("Invalid investor proposal of there is no asset.");

              };
            };
          };
          case (false) {
            return #err("Not allowed this invitation.");
          };
        };
      };
      case (null) {
        return #err("Invitation is not found.");
      };
    };
  };

  public shared (msg) func getMyBuyProposals() : async [DataType.MyProposalResult] {
    let caller : Principal = msg.caller;
    var summaries : [DataType.MyProposalResult] = [];

    if (not isUserNotBanned(caller)) {
      return summaries;
    };

    let myProposals = Array.filter<DataType.BuyProposal>(
      Iter.toArray(buyProposalsStorage.vals()),
      func(proposal : DataType.BuyProposal) : Bool {
        proposal.buyer == caller;
      },
    );

    for (proposal in myProposals.vals()) {
      var totalApproval : Float = 0;
      for ((_, percent) in proposal.approvals.entries()) {
        totalApproval += percent;
      };

      let isApproved = totalApproval >= 51;

      summaries := Array.append(
        summaries,
        [{
          assetId = proposal.assetId;
          downPaymentStatus = proposal.downPaymentStatus;
          isApprove = isApproved;
          approvals = Iter.toArray(proposal.approvals.entries());
        }],
      );
    };

    return summaries;
  };

  public query func getAllAssets() : async [DataType.Asset] {
    Iter.toArray(assetsStorage.vals());
  };

  public shared (msg) func getVotableBuyProposal() : async [DataType.MyVotablePoroposalResult] {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return [];
    };

    var results = Buffer.Buffer<DataType.MyVotablePoroposalResult>(0);

    for ((proposalId, proposal) in buyProposalsStorage.entries()) {
      switch (ownershipsStorage.get(proposal.assetId)) {
        case (?ownershipMap) {
          switch (ownershipMap.get(caller)) {
            case (?ownership) {
              switch (assetsStorage.get(proposal.assetId)) {
                case (?asset) {
                  let createdResults : DataType.MyVotablePoroposalResult = {
                    proposalId = proposal.id;
                    assetId = proposal.assetId;
                    asstName = asset.name;
                    buyer = proposal.buyer;
                    tokenAmount = proposal.amount;
                    pricePerToken = proposal.pricePerToken;
                    approvalResult = Helper.calculateTotalApprovalPercentage(proposal.approvals);
                    myVotePercentage = ownership.percentage;
                  };

                  results.add(createdResults);
                };
                case (null) {};
              };
            };
            case (null) {};
          };
        };
        case (null) {};
      };
    };

    Buffer.toArray(results);
  };

  public query func getUsers() : async [DataType.User] {
    Iter.toArray(usersStorage.vals());
  };

  public shared (msg) func getMyProfiles() : async ?DataType.UserOverviewResult {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return null;
    };

    var totalTx = 0;
    var buy = 0;
    var sell = 0;
    var transfer = 0;
    var dividend = 0;

    for ((_, tx) in transactionsStorage.entries()) {
      if (tx.from == caller) {
        totalTx += 1;
        switch (tx.transactionType) {
          case (#Buy) buy += 1;
          case (#Sell) sell += 1;
          case (#Transfer) transfer += 1;
          case (#Dividend) dividend += 1;
          case (#Downpayment) {};
          case (#DownpaymentCashBack) {};
          case (#Extending) {};
          case (#Redeem) {};
        };
      };
    };

    var totalOwn = 0;
    var ownToken = 0;

    for ((_, owns) in ownershipsStorage.entries()) {
      switch (owns.get(caller)) {
        case (?data) {
          totalOwn += 1;
          ownToken += data.tokenOwned;
        };
        case null {};
      };
    };

    var totalAsset = 0;
    var assetToken = 0;

    for ((_, asset) in assetsStorage.entries()) {
      if (asset.creator == caller) {
        totalAsset += 1;
        assetToken += (asset.totalToken - asset.providedToken);
      };
    };

    switch (usersStorage.get(caller)) {
      case (null) { return null };
      case (?user) {
        return ?{
          userIdentity = user;
          transaction = {
            total = totalTx;
            buy = buy;
            sell = sell;
            transfer = transfer;
            dividend = dividend;
          };
          ownership = {
            total = totalOwn;
            token = ownToken;
          };
          asset = {
            total = totalAsset;
            token = assetToken;
          };
        };
      };
    };
  };

  public shared (msg) func getMyAssets() : async [DataType.Asset] {
    let caller : Principal = msg.caller;
    let data = Array.filter<DataType.Asset>(
      Iter.toArray(assetsStorage.vals()),
      func(asset : DataType.Asset) : Bool {
        asset.creator == caller;
      },
    );
    return data;
  };

  public shared (msg) func getMyOwnerShip() : async [DataType.Ownership] {
    let caller : Principal = msg.caller;
    var myOwnerships : [DataType.Ownership] = [];

    for ((_, ownershipMap) in ownershipsStorage.entries()) {
      switch (ownershipMap.get(caller)) {
        case (?ownership) {
          myOwnerships := Array.append(myOwnerships, [ownership]);
        };
        case (null) {};
      };
    };

    return myOwnerships;
  };

  public shared (msg) func getAssetById(assetId : Text) : async ?DataType.Asset {
    let caller : Principal = msg.caller;
    if (not isUserNotBanned(caller)) {
      return null;
    };

    return assetsStorage.get(assetId);
  };

  public shared (msg) func getAssetFullDetails(assetId : Text) : async ?{
    asset : DataType.Asset;
    ownerships : [DataType.Ownership];
    transactions : [DataType.Transaction];
    dividends : [DataType.Transaction];
  } {

    let caller : Principal = msg.caller;
    if (not isUserNotBanned(caller)) {
      return null;
    };

    let assetOpt = assetsStorage.get(assetId);
    switch (assetOpt) {
      case null {
        return null;
      };
      case (?asset) {
        var ownershipList : [DataType.Ownership] = [];
        switch (ownershipsStorage.get(assetId)) {
          case null {};
          case (?ownersMap) {
            ownershipList := Iter.toArray(ownersMap.vals());
          };
        };

        var transactionList : [DataType.Transaction] = [];
        var dividendList : [DataType.Transaction] = [];
        for ((_, tx) in transactionsStorage.entries()) {
          if (tx.assetId == assetId) {
            transactionList := Array.append(transactionList, [tx]);
            if (tx.transactionType == #Dividend) {
              dividendList := Array.append(dividendList, [tx]);
            };
          };
        };

        return ?{
          asset = asset;
          ownerships = ownershipList;
          transactions = transactionList;
          dividends = dividendList;
        };
      };
    };
  };

  public shared (msg) func createReport(
    targetId : Text,
    reportType : DataType.ReportType,
    content : Text,
    description : Text,
    evidence : ?DataType.TypeReportEvidence,
  ) : async Result.Result<Text, Text> {

    var complainer : Principal = msg.caller;

    if (not isUserNotBanned(complainer)) {
      return #err("You are not allowed to create a report");
    };

    switch (assetsStorage.get(targetId)) {
      case (?_existAsset) {};
      case (null) {
        var foundUser = false;
        label l for ((_, user) in usersStorage.entries()) {
          if (user.id == targetId) {
            foundUser := true;
            break l;
          };
        };

        if (not foundUser) {
          return #err("Invalid target id");
        };
      };
    };

    switch (usersStorage.get(complainer)) {
      case (null) {
        return #err("You are not allowed to create a report");
      };
      case (?existUser) {
        let now = Time.now();
        assetsReportCounter += 1;
        var genReportId = Helper.reportID(assetsReportCounter, reportType);

        var createdReportMap = TrieMap.TrieMap<Principal, DataType.Report>(Principal.equal, Principal.hash);
        var createdReport : DataType.Report = {
          id = genReportId;
          complainer = complainer;
          targetid = targetId;
          reportType = reportType;
          reputation = existUser.kyc_level.riskScore;
          isDone = 0;
          isDoneTimeStamp = 0;
          created = now;
          content = content;
          description = description;
          evidence = evidence;
        };

        createdReportMap.put(complainer, createdReport);

        assetsStorageReport.put(genReportId, createdReportMap);

        return #ok("Report succesfully created" # genReportId);
      };
    };
  };

  public shared (msg) func getUserPublicSignature() : async ?Text {
    var caller : Principal = msg.caller;
    if (not isUserNotBanned(caller)) {
      return null;
    };

    switch (usersStorage.get(caller)) {
      case (null) { return null };
      case (?user) {
        return ?user.publickey;
      };
    };
  };

  public shared (msg) func getReportToMe() : async [DataType.Report] {
    var caller : Principal = msg.caller;
    var reports : [DataType.Report] = [];

    switch (usersStorage.get(caller)) {
      case (null) { return reports };
      case (?user) {
        for (subMap in assetsStorageReport.vals()) {
          for (report in subMap.vals()) {
            if (report.targetid == user.id) {
              reports := Array.append(reports, [report]);
            };
          };
        };
      };
    };

    return reports;
  };

  public shared (msg) func getMyAssetReport() : async [DataType.Report] {
    var caller : Principal = msg.caller;
    var reports : [DataType.Report] = [];

    for (subMap in assetsStorageReport.vals()) {
      for (report in subMap.vals()) {
        switch (assetsStorage.get(report.targetid)) {
          case (null) {};
          case (?asset) {
            if (asset.creator == caller) {
              reports := Array.append(reports, [report]);
            };
          };
        };
      };
    };

    return reports;
  };

  public shared (msg) func getReportDetails(
    reportId : Text
  ) : async ?DataType.Report {
    var caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return null;
    };

    switch (assetsStorageReport.get(reportId)) {
      case (null) { return null };
      case (?reportMap) {
        label lrep for (report in reportMap.vals()) {
          if (report.id == reportId) {
            return ?report;
          };
        };
      };
    };

    return null;
  };

  public shared (msg) func getAssetSignature(
    assetId : Text
  ) : async ?[DataType.DocumentHash] {
    var caller : Principal = msg.caller;
    if (not isUserNotBanned(caller)) {
      return null;
    };

    switch (assetsStorage.get(assetId)) {
      case (null) { return null };
      case (?asset) {
        return ?asset.documentHash;
      };
    };
  };

};
