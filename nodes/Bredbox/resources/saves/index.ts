import type { INodeProperties } from 'n8n-workflow';
import { saveCreateDescription } from './create';
import { saveDeleteDescription } from './delete';
import { saveGetAllDescription } from './getAll';
import { saveSearchDescription } from './search';
import { saveSetTagsDescription } from './setTags';
import { saveUpdateDescription } from './update';


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
				description: 'Create a new save',
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
				description: 'Delete a save permanently',
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
				description: 'Retrieve a single save by ID',
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
				description: 'Retrieve the content of a save',
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
				description: 'Retrieve saves with pagination',
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
				description: 'Retrieve tags on a save',
				routing: {
					request: {
						method: 'GET',
						url: '=/saves/{{$parameter.saveId}}/tags',
					},
				},
			},
			{
				name: 'Restore',
				value: 'postRestore',
				action: 'Restore a trashed save to inbox',
				description: 'Restore a trashed save to Inbox',
				routing: {
					request: {
						method: 'POST',
						url: '=/saves/{{$parameter.saveId}}/restore',
					},
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search saves',
				description: 'Search across saves using full-text query',
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
				name: 'Tags Add',
				value: 'postTagsAdd',
				action: 'Add tags to a specific save by ID',
				description: 'Add tags to a specific save by ID',
				routing: {
					request: {
						method: 'POST',
						url: '=/saves/{{$parameter.saveId}}/tags',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a save',
				description: 'Update a save\'s properties',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/saves/{{$parameter.saveId}}',
					},
				},
			},
		],
		default: 'create',
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
			operation: ['delete', 'get', 'getContent', 'getTags', 'postRestore', 'setTags', 'postTagsAdd', 'update'],
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
					pageSize: 50,
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
	default: 50,
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
					pageSize: 50,
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
	default: 50,
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
					pageSize: 50,
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
	default: 50,
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
	...saveCreateDescription,
	...saveDeleteDescription,
	...saveGetAllDescription,
	...saveSearchDescription,
	...saveSetTagsDescription,
	...saveUpdateDescription,
];
