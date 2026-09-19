import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['patchEmailInboundUpdate'],
	resource: ['me'],
};

export const mePatchEmailInboundUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		required: true,
		default: 'active',
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Disabled', value: 'disabled' },
		],
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'status',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
