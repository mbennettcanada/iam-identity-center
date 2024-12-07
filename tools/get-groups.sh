#!/bin/bash

# Get the AWS SSO instance details
IAM_IDENTITY_CENTER_DETAILS=$(aws sso-admin list-instances --query "Instances[0]" --output json)

# Check if the command was successful
if [ $? -ne 0 ]; then
  echo "Failed to retrieve IAM Identity Center ARN"
  exit 1
fi

IDENTITY_STORE_ID=$(echo $IAM_IDENTITY_CENTER_DETAILS | jq -r '.IdentityStoreId')
echo $IDENTITY_STORE_ID
# List all groups in IAM Identity Center
GROUPS=$(aws identitystore list-groups --identity-store-id $IDENTITY_STORE_ID --query "Groups[*].{Id:GroupId,Name:DisplayName}" --output json)

# Check if the command was successful
if [ $? -ne 0 ]; then
  echo "Failed to retrieve groups"
  exit 1
fi

# Create a JSON file with the group IDs and names
echo $GROUPS > iam_identity_center_groups.json

echo "Group IDs and names have been written to iam_identity_center_groups.json"