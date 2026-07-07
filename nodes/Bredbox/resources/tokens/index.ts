import type { INodeProperties } from 'n8n-workflow';
import { tokenCreateDescription } from './create';
import { tokenUpdateDescription } from './update';


const showOnlyFor = {
	resource: ['token'],
};

export const tokenDescription: INodeProperties[] = [
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
				action: 'List API tokens',
				description: 'List API tokens',
				routing: {
					request: {
						method: 'GET',
						url: '/tokens',
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
				action: 'Get an API token by ID',
				description: 'Get an API token by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/tokens/{{$parameter.tokenId}}',
					},
				},
			},
			{
				name: 'Get Scopes',
				value: 'getScopes',
				action: 'List available API token scopes',
				description: 'Returns the canonical scope catalog for v2 endpoints, including separate `:write` and `:delete` scopes where applicable. There is no `/v2/webhooks/scopes` endpoint.',
				routing: {
					request: {
						method: 'GET',
						url: '/tokens/scopes',
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
				action: 'Create a new API token',
				description: 'Create a new API token',
				routing: {
					request: {
						method: 'POST',
						url: '/tokens',
					},
				},
			},
			{
				name: 'Regenerate',
				value: 'regenerate',
				action: 'Regenerate an API token',
				description: 'Regenerate an API token',
				routing: {
					request: {
						method: 'POST',
						url: '=/tokens/{{$parameter.tokenId}}/regenerate',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update and regenerate an API token',
				description: 'Update and regenerate an API token',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/tokens/{{$parameter.tokenId}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Revoke an API token',
				description: 'Revoke an API token',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/tokens/{{$parameter.tokenId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
	displayName: 'Token ID',
	name: 'tokenId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['token'],
			operation: ['get', 'regenerate', 'update', 'delete'],
		},
	},
	description: 'Token ID of the token',
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['token'],
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
			resource: ['token'],
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
	...tokenCreateDescription,
	...tokenUpdateDescription,
];
