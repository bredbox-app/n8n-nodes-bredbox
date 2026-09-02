import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['putPersonalizationPut'],
	resource: ['me'],
};

export const mePutPersonalizationPutDescription: INodeProperties[] = [
	{
		displayName: 'Personalization Enabled',
		name: 'personalization_enabled',
		type: 'boolean',
		required: true,
		default: false,
		description: 'Whether to personalization enabled',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'personalization_enabled',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
