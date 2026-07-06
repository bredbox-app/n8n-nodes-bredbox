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
		displayOptions: {
			show: showOnlyFor,
		},
		description: 'Whether the save is a favorite',
		routing: {
			send: {
				type: 'body',
				property: 'is_favorite',
			},
		},
	},
	{
		displayName: 'Is Archived',
		name: 'is_archived',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyFor,
		},
		description: 'Whether the save is archived',
		routing: {
			send: {
				type: 'body',
				property: 'is_archived',
			},
		},
	},
];
