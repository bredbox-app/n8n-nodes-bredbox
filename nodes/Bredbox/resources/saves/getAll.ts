import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['getAll'],
	resource: ['save'],
};

export const saveGetAllDescription: INodeProperties[] = [
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'options',
		default: 'all',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Archived', value: 'archived' },
			{ name: 'Favorites', value: 'favorites' },
			{ name: 'Highlights', value: 'highlights' },
			{ name: 'Inbox', value: 'inbox' },
			{ name: 'Reading', value: 'reading' },
			{ name: 'Trash', value: 'trash' },
			{ name: 'Untagged', value: 'untagged' },
		],
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'filter',
			},
		},
	},
	{
		displayName: 'Restricts the List to Saves of This Type. Repeat the Parameter to List Saves of Any of Several Types, Such as `Type=article&type=video`.',
		name: 'type',
		type: 'string',
		default: '',
		description: 'Restricts the list to saves of this type. Repeat the parameter to list saves of any of several types, such as `type=article&type=video`.',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'type',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
