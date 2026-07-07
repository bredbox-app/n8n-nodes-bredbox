import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['addItem'],
	resource: ['collection'],
};

export const collectionAddItemDescription: INodeProperties[] = [
	{
		displayName: 'User Save ID',
		name: 'user_save_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'user_save_id',
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
