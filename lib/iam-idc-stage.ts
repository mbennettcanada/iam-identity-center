import { IamIDC } from './iam-idc';
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class IamIDCStage  extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new IamIDC(this, 'DeployGithubProvider');
    }
}