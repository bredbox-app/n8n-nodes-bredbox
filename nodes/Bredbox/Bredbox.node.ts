import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { saveDescription } from './resources/saves';
import { highlightDescription } from './resources/highlights';
import { importDescription } from './resources/imports';
import { exportDescription } from './resources/exports';
import { tagDescription } from './resources/tags';
import { collectionDescription } from './resources/collections';
import { meDescription } from './resources/me';
import { tokenDescription } from './resources/tokens';
import { webhookDescription } from './resources/webhooks';
import { authorizationDescription } from './resources/authorizations';

export class Bredbox implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bredbox',
		name: 'bredbox',
		icon: 'file:bredbox.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Bredbox API',
		defaults: {
			name: 'Bredbox',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'bredboxApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Authorization',
						value: 'authorization',
					},
					{
						name: 'Collection',
						value: 'collection',
					},
					{
						name: 'Export',
						value: 'export',
					},
					{
						name: 'Highlight',
						value: 'highlight',
					},
					{
						name: 'Import',
						value: 'import',
					},
					{
						name: 'Me',
						value: 'me',
					},
					{
						name: 'Save',
						value: 'save',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
					{
						name: 'Token',
						value: 'token',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'save',
			},
			...saveDescription,
			...highlightDescription,
			...importDescription,
			...exportDescription,
			...tagDescription,
			...collectionDescription,
			...meDescription,
			...tokenDescription,
			...webhookDescription,
			...authorizationDescription,
		],
	};
}
