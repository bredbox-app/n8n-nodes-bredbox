import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['getByUrl'],
	resource: ['save'],
};

export const saveGetByUrlDescription: INodeProperties[] = [
	{
		displayName: 'The Page URL to Look up in the User\'s Library',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		description: 'The page URL to look up in the user\'s library',
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
