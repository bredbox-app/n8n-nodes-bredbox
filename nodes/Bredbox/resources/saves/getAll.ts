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
			{ name: 'Trash', value: 'trash' },
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
		displayName: 'Type',
		name: 'type',
		type: 'options',
		default: 'article',
		options: [
			{ name: 'Article', value: 'article' },
			{ name: 'Audio', value: 'audio' },
			{ name: 'Image', value: 'image' },
			{ name: 'Other', value: 'other' },
			{ name: 'Recipe', value: 'recipe' },
			{ name: 'Video', value: 'video' },
		],
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
