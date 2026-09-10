import type { INodeProperties } from 'n8n-workflow';
import { tagPatchRenameDescription } from './patchRename';


const showOnlyFor = {
	resource: ['tag'],
};

export const tagDescription: INodeProperties[] = [
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
				name: 'Delete',
				value: 'delete',
				action: 'Delete a tag',
				description: 'Delete a tag permanently',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/tags/{{$parameter.tagName}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tags',
				description: 'Retrieve tags with pagination',
				routing: {
					request: {
						method: 'GET',
						url: '/tags',
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
				name: 'Get Saves',
				value: 'getSaves',
				action: 'Get saves for tag',
				description: 'Retrieve saves with a specific tag',
				routing: {
					request: {
						method: 'GET',
						url: '=/tags/{{$parameter.tagName}}',
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
				name: 'Rename',
				value: 'patchRename',
				action: 'Rename a tag across all of your saves',
				description: 'Rename a tag across all of your saves',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/tags/{{$parameter.tagName}}',
					},
				},
			},
			{
				name: 'Usage',
				value: 'getUsage',
				action: 'Count the saves carrying a tag',
				description: 'Count the saves carrying a tag',
				routing: {
					request: {
						method: 'GET',
						url: '=/tags/{{$parameter.tagName}}/usage',
					},
				},
			},
		],
		default: 'delete',
	},
	{
	displayName: 'Tag Name',
	name: 'tagName',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['tag'],
			operation: ['delete', 'getSaves', 'patchRename', 'getUsage'],
		},
	},
	description: 'Tag Name of the tag',
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['tag'],
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
			resource: ['tag'],
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
			resource: ['tag'],
			operation: ['getSaves'],
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
			resource: ['tag'],
			operation: ['getSaves'],
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
	...tagPatchRenameDescription,
];
