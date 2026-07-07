import type { INodeProperties } from 'n8n-workflow';
import { saveGetAllDescription } from './getAll';
import { saveSearchDescription } from './search';
import { saveCreateDescription } from './create';
import { saveUpdateDescription } from './update';
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
				name: 'Get Many',
				value: 'getAll',
				action: 'List user saves with filtering and pagination',
				description: 'List user saves with filtering and pagination',
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
				name: 'Get',
				value: 'get',
				action: 'Get a single user save by ID',
				description: 'Get a single user save by ID',
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
				action: 'Get content for a save',
				description: 'Retrieves the content for a given save.',
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
				name: 'Get Tags',
				value: 'getTags',
				action: 'Get all tags for a specific save by ID',
				description: 'Get all tags for a specific save by ID',
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
				action: 'Search user saves with full-text search',
				description: 'Search user saves with full-text search',
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
				name: 'Create',
				value: 'create',
				action: 'Create a new user save',
				description: 'Create a new user save',
				routing: {
					request: {
						method: 'POST',
						url: '/saves',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a single user save by ID',
				description: 'Update a single user save by ID',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/saves/{{$parameter.saveId}}',
					},
				},
			},
			{
				name: 'Set Tags',
				value: 'setTags',
				action: 'Set all tags for a specific save by ID',
				description: 'Set all tags for a specific save by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/saves/{{$parameter.saveId}}/tags',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a single user save by ID',
				description: 'Delete a single user save by ID',
				routing: {
					request: {
						method: 'DELETE',
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
			operation: ['get', 'getContent', 'getTags', 'update', 'setTags', 'delete'],
		},
	},
	description: 'Save ID of the save',
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['save'],
			operation: ['getAll'],
		},
	},
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
	default: 30,
	displayOptions: {
		show: {
			resource: ['save'],
			operation: ['getAll'],
		},
	},
	description: 'Max number of results to return',
	typeOptions: {
		minValue: 1,
	},
	routing: {
		send: {
			type: 'query',
			property: 'per_page',
		},
	},
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['save'],
			operation: ['getTags'],
		},
	},
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
	default: 30,
	displayOptions: {
		show: {
			resource: ['save'],
			operation: ['getTags'],
		},
	},
	description: 'Max number of results to return',
	typeOptions: {
		minValue: 1,
	},
	routing: {
		send: {
			type: 'query',
			property: 'per_page',
		},
	},
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['save'],
			operation: ['search'],
		},
	},
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
					pageSize: 10,
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
	default: 10,
	displayOptions: {
		show: {
			resource: ['save'],
			operation: ['search'],
		},
	},
	description: 'Max number of results to return',
	typeOptions: {
		minValue: 1,
	},
	routing: {
		send: {
			type: 'query',
			property: 'per_page',
		},
	},
},
	...saveGetAllDescription,
	...saveSearchDescription,
	...saveCreateDescription,
	...saveUpdateDescription,
	...saveSetTagsDescription,
];
