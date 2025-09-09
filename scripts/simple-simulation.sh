#!/bin/bash

# === Fungsi Identity ===
choose_identity() {
  echo "Pilih identity:"
  echo "1) findway_agent1"
  echo "2) findway_agent2"
  echo "3) findway_dev"
  read -p "Pilihan (1-3): " choice

  case $choice in
    1) CURRENT_IDENTITY="findway_agent1" ;;
    2) CURRENT_IDENTITY="findway_agent2" ;;
    3) CURRENT_IDENTITY="findway_dev" ;;
    *) echo "Pilihan tidak valid. Default ke findway_dev"; CURRENT_IDENTITY="findway_dev" ;;
  esac

  dfx identity use $CURRENT_IDENTITY
  echo "✅ Identity aktif: $CURRENT_IDENTITY"
}

# === Wrapper Call ===
call_backend() {
  dfx identity use $CURRENT_IDENTITY
  dfx canister call backend "$@"
}

# === Semua Fungsi ===
registUser() {
  local fullName="$1"
  local lastName="$2"
  local phone="$3"
  local country="$4"
  local city="$5"
  local userIDNumber="$6"
  local userIdentity="$7"

  call_backend registUser "(\"$fullName\", \"$lastName\", \"$phone\", \"$country\", \"$city\", \"$userIDNumber\", $userIdentity)"
}

createAsset() {
  local name="$1"
  local description="$2"
  local totalToken="$3"
  local providedToken="$4"
  local minTokenPurchased="$5"
  local maxTokenPurchased="$6"
  local pricePerToken="$7"
  local locationInfo="$8"
  local documentHash="$9"
  local assetType="${10}"
  local assetStatus="${11}"
  local rule="${12}"
  local riskScore="${13}"

  call_backend createAsset \
  "(\"$name\", \"$description\", $totalToken, $providedToken, $minTokenPurchased, $maxTokenPurchased, $pricePerToken, $locationInfo, $documentHash, $assetType, $assetStatus, $rule, $riskScore)"
}

proposedBuyToken() {
  local assetId="$1"
  local amount="$2"
  local pricePerToken="$3"

  call_backend proposedBuyToken "(\"$assetId\", $amount, $pricePerToken)"
}

proceedDownPayment() {
  local price="$1"
  local buyProposalId="$2"

  call_backend proceedDownPayment "($price, \"$buyProposalId\")"
}

finishedPayment() {
  local proposalId="$1"
  local price="$2"

  call_backend finishedPayment "(\"$proposalId\", $price)"
}

approveBuyProposal() {
  local buyProposalId="$1"
  call_backend approveBuyProposal "(\"$buyProposalId\")"
}

createInvestorProposal() {
  local assetId="$1"
  local incomingInvestor="$2"
  local amount="$3"
  local pricePerToken="$4"

  call_backend createIvestorProposal "(\"$assetId\", principal \"$incomingInvestor\", $amount, $pricePerToken)"
}

approveInvestorProposal() {
  local investorProposalId="$1"
  call_backend approveInvestorProposal "(\"$investorProposalId\")"
}

finishTheInvitation() {
  local investorProposalId="$1"
  local price="$2"

  call_backend finishTheInvitation "(\"$investorProposalId\", $price)"
}

getMyBuyProposals() { call_backend getMyBuyProposals; }
getAllAssets() { call_backend getAllAssets; }
getVotableBuyProposal() { call_backend getVotableBuyProposal; }
getUsers() { call_backend getUsers; }
getMyAssets() { call_backend getMyAssets; }
getMyOwnership() { call_backend getMyOwnerShip; }

# === Main Menu ===
choose_identity

while true; do
  echo ""
  echo "=== MENU ==="
  echo "1) registUser"
  echo "2) createAsset"
  echo "3) proposedBuyToken"
  echo "4) proceedDownPayment"
  echo "5) finishedPayment"
  echo "6) approveBuyProposal"
  echo "7) createInvestorProposal"
  echo "8) approveInvestorProposal"
  echo "9) finishTheInvitation"
  echo "10) getMyBuyProposals"
  echo "11) getAllAssets"
  echo "12) getVotableBuyProposal"
  echo "13) getUsers"
  echo "14) getMyAssets"
  echo "15) getMyOwnership"
  echo "16) Ganti Identity"
  echo "0) Keluar"
  read -p "Pilih menu: " menu

  case $menu in
    1) read -p "FullName: " fn; read -p "LastName: " ln; read -p "Phone: " ph; read -p "Country: " co; read -p "City: " ci; read -p "UserID: " uid; read -p "Identity: " idn; registUser "$fn" "$ln" "$ph" "$co" "$ci" "$uid" "$idn";;
    2) echo "⚠️ isi manual sesuai input createAsset";;
    3) read -p "AssetId: " aid; read -p "Amount: " am; read -p "PricePerToken: " ppt; proposedBuyToken "$aid" "$am" "$ppt";;
    4) read -p "Price: " pr; read -p "BuyProposalId: " bpid; proceedDownPayment "$pr" "$bpid";;
    5) read -p "ProposalId: " pid; read -p "Price: " pr; finishedPayment "$pid" "$pr";;
    6) read -p "BuyProposalId: " bpid; approveBuyProposal "$bpid";;
    7) read -p "AssetId: " aid; read -p "Investor Principal: " inv; read -p "Amount: " am; read -p "PricePerToken: " ppt; createInvestorProposal "$aid" "$inv" "$am" "$ppt";;
    8) read -p "InvestorProposalId: " ipid; approveInvestorProposal "$ipid";;
    9) read -p "InvestorProposalId: " ipid; read -p "Price: " pr; finishTheInvitation "$ipid" "$pr";;
    10) getMyBuyProposals;;
    11) getAllAssets;;
    12) getVotableBuyProposal;;
    13) getUsers;;
    14) getMyAssets;;
    15) getMyOwnership;;
    16) choose_identity;;
    0) echo "Bye!"; exit 0;;
    *) echo "Pilihan tidak valid";;
  esac
done
