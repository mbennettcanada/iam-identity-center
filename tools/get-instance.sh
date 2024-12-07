#!/bin/bash

# Get the AWS SSO instance ID
IAM_IDENTITY_CENTER_ARN=$(aws sso-admin list-instances --query "Instances[0].InstanceArn" --output text)

# Check if the command was successful
if [ $? -ne 0 ]; then
  echo "Failed to retrieve IAM Identity Center ARN"
  exit 1
fi

# Remove any trailing newlines or spaces and ensure only the ARN is captured
IAM_IDENTITY_CENTER_ARN=$(echo $IAM_IDENTITY_CENTER_ARN | awk '{print $1}')

# Create a JSON file with the ARN
cat <<EOF > iam_identity_center_arn.json
{
  "IAM_IDENTITY_CENTER_ARN": "$IAM_IDENTITY_CENTER_ARN"
}
EOF

echo "IAM Identity Center ARN has been written to iam_identity_center_arn.json"