import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['search'],
	resource: ['save'],
};

export const saveSearchDescription: INodeProperties[] = [
	{
		displayName: 'Search query string',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		description: 'Search query string',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'q',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
