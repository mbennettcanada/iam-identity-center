import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, CodeBuildStep } from 'aws-cdk-lib/pipelines';
import { IamIDCStage } from './iam-idc-stage';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class IamIdentityCenterPipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'cdk-stacksets-pipeline',
      selfMutation: true,
      synth: new CodeBuildStep('SynthStep', {
        input: CodePipelineSource.connection('mbennettcanada/iam-identity-center', 'main',{connectionArn: "arn:aws:codeconnections:us-east-2:906948391283:connection/f278b7a7-9149-4f82-9430-873abe47d275"}),
        installCommands: [
          'npm install -g aws-cdk'
        ],
        commands: [
          'sh ../tools/get-instance.sh',
          'sh ../tools/get-groups.sh',
          'sh ../tools/get-accounts.sh',
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ]
      }
      )
    });
    const deployWave = pipeline.addWave('DeployChanges');
    const iamIDCStage = new IamIDCStage(this, 'Deploy');    
    deployWave.addStage(iamIDCStage);
    pipeline.buildPipeline()

    pipeline.pipeline.addToRolePolicy (new PolicyStatement({
      actions: [
        'sso-admin:ListInstances',
        'identitystore:ListGroups',
        'organizations:ListAccounts'
      ],
      resources: ['*'],
    }));
  
  }
}
