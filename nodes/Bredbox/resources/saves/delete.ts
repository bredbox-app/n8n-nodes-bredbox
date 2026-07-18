import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['delete'],
	resource: ['save'],
};

export const saveDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Permanent',
		name: 'permanent',
		type: 'string',
		default: 'false',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'permanent',
			},
		},
	},
];
