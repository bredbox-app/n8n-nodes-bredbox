import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['search'],
	resource: ['save'],
};

export const saveSearchDescription: INodeProperties[] = [
	{
		displayName: 'Search Query String',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'q',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Limits the Search to One List of Saves. `All` Searches Every Save Outside the Trash.',
		name: 'filter',
		type: 'options',
		default: 'all',
		description: 'Limits the search to one list of saves. `all` searches every save outside the trash.',
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
		displayName: 'Limits the Search to Saves of This Type. Repeat the Parameter to Match Any of Several Types.',
		name: 'type',
		type: 'string',
		default: '',
		description: 'Limits the search to saves of this type. Repeat the parameter to match any of several types.',
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
