import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['getStatus'],
	resource: ['save'],
};

export const saveGetStatusDescription: INodeProperties[] = [
	{
		displayName: 'The Page URL to Check Against the User\'s Library',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		description: 'The page URL to check against the user\'s library',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'url',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
