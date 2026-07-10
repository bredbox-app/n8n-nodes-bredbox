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
			{ name: 'Favorites', value: 'favorites' },
			{ name: 'Archived', value: 'archived' },
			{ name: 'Unarchived', value: 'unarchived' },
			{ name: 'Highlights', value: 'highlights' },
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
			{ name: 'Recipe', value: 'recipe' },
			{ name: 'Video', value: 'video' },
			{ name: 'Audio', value: 'audio' },
			{ name: 'Image', value: 'image' },
			{ name: 'Other', value: 'other' },
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
