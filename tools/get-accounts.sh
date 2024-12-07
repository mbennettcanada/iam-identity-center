#!/bin/bash

# Get the list of accounts in the organization
ACCOUNTS=$(aws organizations list-accounts --query "Accounts[*].{Id:Id,Name:Name}" --output json)

# Check if the command was successful
if [ $? -ne 0 ]; then
  echo "Failed to retrieve accounts"
  exit 1
fi

# Create a JSON file with the account IDs and names
echo $ACCOUNTS > organization_accounts.json

echo "Account IDs and names have been written to organization_accounts.json"