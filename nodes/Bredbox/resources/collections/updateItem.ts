import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['updateItem'],
	resource: ['collection'],
};

export const collectionUpdateItemDescription: INodeProperties[] = [
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		default: 'up',
		options: [
			{ name: 'Up', value: 'up' },
			{ name: 'Down', value: 'down' },
		],
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'direction',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'note',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
