import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['update'],
	resource: ['save'],
};

export const saveUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Is Favorite',
		name: 'is_favorite',
		type: 'boolean',
		default: false,
		description: 'Whether the save is favorite',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'is_favorite',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Is Archived',
		name: 'is_archived',
		type: 'boolean',
		default: false,
		description: 'Whether the save is archived',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'is_archived',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'title',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
