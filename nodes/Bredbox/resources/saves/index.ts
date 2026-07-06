import type { INodeProperties } from 'n8n-workflow';
import { saveCreateDescription } from './create';
import { saveUpdateDescription } from './update';
import { saveSearchDescription } from './search';
import { saveSetTagsDescription } from './setTags';

const showOnlyFor = {
	resource: ['save'],
};

export const saveDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyFor,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a save',
				description: 'Save a URL or content to Bredbox',
				routing: {
					request: {
						method: 'POST',
						url: '/saves',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a save',
				description: 'Delete a save by ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/saves/{{$parameter.saveId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a save',
				description: 'Get a single save by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/saves/{{$parameter.saveId}}',
					},
				},
			},
			{
				name: 'Get Content',
				value: 'getContent',
				action: 'Get save content',
				description: 'Get the HTML or text content of a save',
				routing: {
					request: {
						method: 'GET',
						url: '=/saves/{{$parameter.saveId}}/content',
						headers: {
							Accept: 'text/plain',
						},
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many saves',
				description: 'Get a paginated list of saves',
				routing: {
					request: {
						method: 'GET',
						url: '/saves',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'items',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get Tags',
				value: 'getTags',
				action: 'Get save tags',
				description: 'Get all tags for a save',
				routing: {
					request: {
						method: 'GET',
						url: '=/saves/{{$parameter.saveId}}/tags',
					},
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search saves',
				description: 'Full-text search across saves',
				routing: {
					request: {
						method: 'GET',
						url: '/saves/search',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'items',
								},
							},
						],
					},
				},
			},
			{
				name: 'Set Tags',
				value: 'setTags',
				action: 'Set save tags',
				description: 'Replace all tags on a save',
				routing: {
					request: {
						method: 'PUT',
						url: '=/saves/{{$parameter.saveId}}/tags',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a save',
				description: 'Update a save (favorite or archive status)',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/saves/{{$parameter.saveId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Save ID',
		name: 'saveId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['save'],
				operation: ['get', 'update', 'delete', 'getContent', 'getTags', 'setTags'],
			},
		},
		description: 'ID of the save',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['save'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $value }}',
			},
			operations: {
				pagination: {
					type: 'offset',
					properties: {
						limitParameter: 'per_page',
						offsetParameter: 'page',
						pageSize: 30,
						type: 'query',
					},
				},
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['save'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		routing: {
			send: {
				type: 'query',
				property: 'per_page',
				value: '={{ $value }}',
			},
			output: {
				maxResults: '={{ $value }}',
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		default: 'all',
		displayOptions: {
			show: {
				resource: ['save'],
				operation: ['getAll'],
			},
		},
		description: 'Filter saves by status. Leave blank for all saves.',
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
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['save'],
				operation: ['getAll'],
			},
		},
		description: 'Filter saves by content type',
		routing: {
			send: {
				type: 'query',
				property: 'type',
			},
		},
	},
	...saveCreateDescription,
	...saveUpdateDescription,
	...saveSearchDescription,
	...saveSetTagsDescription,
];
