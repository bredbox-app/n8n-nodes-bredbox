import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['getContent'],
	resource: ['save'],
};

export const saveGetContentDescription: INodeProperties[] = [
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		default: 'auto',
		options: [
			{ name: 'Auto', value: 'auto' },
			{ name: 'Binary', value: 'binary' },
			{ name: 'HTML', value: 'html' },
			{ name: 'Text', value: 'text' },
		],
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'format',
			},
		},
	},
	{
		displayName: 'Max Length',
		name: 'max_length',
		type: 'number',
		default: 100000,
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'max_length',
			},
		},
	},
];
