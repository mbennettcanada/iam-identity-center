#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IamIdentityCenterPipeline } from '../lib/iam-identity-center-pipeline';

const app = new cdk.App();
new IamIdentityCenterPipeline(app, 'IamIdentityCenterStack', {
});