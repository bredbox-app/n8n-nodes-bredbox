import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['search'],
	resource: ['save'],
};

export const saveSearchDescription: INodeProperties[] = [
	{
		displayName: 'Search Query String',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
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
