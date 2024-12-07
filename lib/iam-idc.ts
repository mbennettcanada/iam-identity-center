import * as cdk from 'aws-cdk-lib';
import { CfnPermissionSet, CfnAssignment } from 'aws-cdk-lib/aws-sso';
import { Construct } from 'constructs';
import * as path from 'path';

const arnJsonData = require(path.resolve(__dirname, '../iam_identity_center_arn.json'));
const groupsJsonData = require(path.resolve(__dirname, '../iam_identity_center_groups.json'));
const accountsJsonData = require(path.resolve(__dirname, '../organization_accounts.json'));
const identityCenterInstanceArn: string = arnJsonData.IAM_IDENTITY_CENTER_ARN;

export class IamIDC extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const adminPermissionSet = new CfnPermissionSet(this, 'AdminPermissionSet', {
            instanceArn: identityCenterInstanceArn,
            name: 'AdminAccess',
            description: 'Administrator access permission set',
            sessionDuration: 'PT8H', // 8 hours
            managedPolicies: [
              'arn:aws:iam::aws:policy/AdministratorAccess'
            ]
        });

        const adminGroup = groupsJsonData.find((group: { Id: string; Name: string }) => group.Name === 'Admin');
        const operationsAccount = accountsJsonData.find((account: {Id: string; Name: string}) => account.Name === 'Operations')
        //This could be wrapped in an if statement ensuring admin group and operations account are actually found, but it would have the result of wiping out access if the shell scripts retreiving that data don't work. We WANT the synth to fail if those are not found. 
        new CfnAssignment(this, 'AdminGroupAssignment', {
            instanceArn: identityCenterInstanceArn,
            permissionSetArn: adminPermissionSet.attrPermissionSetArn,
            principalId: adminGroup.Id,
            principalType: 'GROUP',
            targetId: operationsAccount.Id, 
            targetType: 'AWS_ACCOUNT'
        });

    }
}