#!/bin/bash


registUser() {
  local fullName="$1"
  local lastName="$2"
  local phone="$3"
  local country="$4"
  local city="$5"
  local userIDNumber="$6"
  local userIdentity="$7"

  dfx canister call backend registUser \
  "(\"$fullName\", \"$lastName\", \"$phone\", \"$country\", \"$city\", \"$userIDNumber\", $userIdentity)"
}
createAsset() {
  local name="$1"
  local description="$2"
  local totalToken="$3"
  local providedToken="$4"
  local minTokenPurchased="$5"
  local maxTokenPurchased="$6"
  local pricePerToken="$7"
  local locationInfo="$8"    # Candid record { lat=...; long=...; details=vec {...} }
  local documentHash="$9"    # Candid vec { record { ... } }
  local assetType="${10}"    # Candid variant { ... }
  local assetStatus="${11}"  # Candid variant { ... }
  local rule="${12}"         # Candid record { ... }
  local riskScore="${13}"    # Float

  dfx canister call backend createAsset \
  "(\"$name\", \"$description\", $totalToken, $providedToken, $minTokenPurchased, $maxTokenPurchased, $pricePerToken, $locationInfo, $documentHash, $assetType, $assetStatus, $rule, $riskScore)"
}

proposedBuyToken() {
  local assetId="$1"
  local amount="$2"
  local pricePerToken="$3"

  dfx canister call backend proposedBuyToken \
  "(\"$assetId\", $amount, $pricePerToken)"
}

proceedDownPayment() {
  local price="$1"
  local buyProposalId="$2"

  dfx canister call backend proceedDownPayment \
  "($price, \"$buyProposalId\")"
}

finishedPayment() {
  local proposalId="$1"
  local price="$2"

  dfx canister call backend finishedPayment \
  "(\"$proposalId\", $price)"
}

approveBuyProposal() {
  local buyProposalId="$1"

  dfx canister call backend approveBuyProposal \
  "(\"$buyProposalId\")"
}

createInvestorProposal() {
  local assetId="$1"
  local incomingInvestor="$2"
  local amount="$3"
  local pricePerToken="$4"

  dfx canister call backend createIvestorProposal \
  "(\"$assetId\", principal \"$incomingInvestor\", $amount, $pricePerToken)"
}

approveInvestorProposal() {
  local investorProposalId="$1"

  dfx canister call backend approveInvestorProposal \
  "(\"$investorProposalId\")"
}

finishTheInvitation() {
  local investorProposalId="$1"
  local price="$2"

  dfx canister call backend finishTheInvitation \
  "(\"$investorProposalId\", $price)"
}

getMyBuyProposals() {
  dfx canister call backend getMyBuyProposals
}

getAllAssets() {
  dfx canister call backend getAllAssets
}

getVotableBuyProposal() {
  dfx canister call backend getVotableBuyProposal
}

getUsers() {
  dfx canister call backend getUsers
}

getMyAssets() {
  dfx canister call backend getMyAssets
}

getMyOwnership() {
  dfx canister call backend getMyOwnerShip
}

#!/bin/bash

# Asset data arrays
NAMES=("Emerald Tower" "Crimson Car" "Sunset Villa" "Blue Lagoon Resort" "Golden Coin Machine")
DESCRIPTIONS=("High-end investment" "Luxury property" "Premium business asset" "Rare artwork" "Vehicle for logistics")
COUNTRIES=("Indonesia" "Singapore" "Malaysia" "Thailand" "Japan")
ASSET_TYPES=("variant { Property }" "variant { Vehicle }" "variant { Business }" "variant { Artwork }" "variant { Equipment }")

# Simple city data with guaranteed coordinates
CITIES=("Jakarta" "Singapore" "Bangkok" "Tokyo" "Sydney")

# Utility functions
rand_from_array() {
    local arr=("$@")
    echo "${arr[$RANDOM % ${#arr[@]}]}"
}

rand_range() {
    echo $((RANDOM % ($2 - $1 + 1) + $1))
}

get_coordinates() {
    local city="$1"
    case $city in
        "Jakarta") echo "-6.2088,106.8456" ;;
        "Singapore") echo "1.3521,103.8198" ;;
        "Bangkok") echo "13.7563,100.5018" ;;
        "Tokyo") echo "35.6762,139.6503" ;;
        "Sydney") echo "-33.8688,151.2093" ;;
        *) echo "-6.2088,106.8456" ;; # Default to Jakarta
    esac
}

# Create single asset function for debugging
createSingleAsset() {
    local ASSET_NUMBER="$1"
    
    # Generate data
    NAME=$(rand_from_array "${NAMES[@]}")
    DESCRIPTION=$(rand_from_array "${DESCRIPTIONS[@]}")
    TOTAL_TOKEN=$(rand_range 500 2000)
    PROVIDED_TOKEN=$(rand_range 100 500)
    MIN_PURCHASE=$(rand_range 5 20)
    MAX_PURCHASE=$(rand_range 50 200)
    PRICE_PER_TOKEN=$(rand_range 100 500)
    CITY=$(rand_from_array "${CITIES[@]}")
    COUNTRY=$(rand_from_array "${COUNTRIES[@]}")
    ASSET_TYPE=$(rand_from_array "${ASSET_TYPES[@]}")
    
    # Get coordinates
    COORDS=$(get_coordinates "$CITY")
    LAT=$(echo "$COORDS" | cut -d',' -f1)
    LONG=$(echo "$COORDS" | cut -d',' -f2)
    
    # Generate hash
    DOC_HASH="doc_hash_$(date +%s)_${ASSET_NUMBER}"
    
    echo "=== Asset $ASSET_NUMBER ==="
    echo "Name: $NAME"
    echo "Description: $DESCRIPTION"
    echo "Location: $CITY, $COUNTRY ($LAT, $LONG)"
    echo "Tokens: $TOTAL_TOKEN total, $PROVIDED_TOKEN provided"
    echo "Price: $PRICE_PER_TOKEN per token"
    echo "Type: $ASSET_TYPE"
    echo "Hash: $DOC_HASH"
    echo ""
    
    # Create the asset with explicit formatting
    echo "Calling createAsset..."
    dfx canister call backend createAsset \
        "(\"${NAME}\", \"${DESCRIPTION}\", ${TOTAL_TOKEN} : nat, ${PROVIDED_TOKEN} : nat, ${MIN_PURCHASE} : nat, ${MAX_PURCHASE} : nat, ${PRICE_PER_TOKEN} : nat, record { lat = ${LAT} : float64; long = ${LONG} : float64; details = vec { \"${CITY}\"; \"${COUNTRY}\" } }, vec { record { name = \"Legal Document\"; description = \"Asset verification\"; hash = \"${DOC_HASH}\" } }, ${ASSET_TYPE}, variant { Open }, record { sellSharing = true : bool; sellSharingNeedVote = false : bool; sellSharingPrice = 500 : nat; needDownPayment = true : bool; minDownPaymentPercentage = 0.2 : float64; downPaymentCashback = 0.05 : float64; downPaymentMaturityTime = 30 : nat; paymentMaturityTime = 90 : int; ownerShipMaturityTime = 365 : int; details = vec { \"Standard rule\" } })"
    
    local RESULT=$?
    if [[ $RESULT -eq 0 ]]; then
        echo "✓ Asset $ASSET_NUMBER created successfully!"
    else
        echo "✗ Asset $ASSET_NUMBER failed to create"
        return 1
    fi
    echo "----------------------------------------"
}

# Asset creation function
createAsset() {
    local AGENT="$1"
    local COUNT="$2"

    echo "=== Creating $COUNT assets by $AGENT ==="
    
    # Switch to the agent identity
    dfx identity use "$AGENT"

    for i in $(seq 1 $COUNT); do
        createSingleAsset $i
        if [[ $? -ne 0 ]]; then
            echo "Stopping due to error in asset $i"
            break
        fi
        sleep 1  # Small delay between calls
    done
}

# Test single asset first
test_single_asset() {
    echo "Testing single asset creation..."
    dfx identity use findway_agent1
    createSingleAsset "test"
}

# Main execution
echo "Starting asset creation process..."

# Register user first
dfx identity use findway_agent1
echo "Registering user..."
registUser "John" "Doe" "08123456789" "Indonesia" "Jakarta" "ID123" 'variant { IdentityNumber }'

echo ""
echo "Choose an option:"
echo "1. Test single asset creation"
echo "2. Create all 15 assets"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        test_single_asset
        ;;
    2)
        createAsset "findway_agent1" 15
        ;;
    *)
        echo "Invalid choice. Testing single asset..."
        test_single_asset
        ;;
esac

echo "Process completed!"