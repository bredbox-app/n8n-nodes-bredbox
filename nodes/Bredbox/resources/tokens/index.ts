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
				name: 'Create',
				value: 'create',
				action: 'Create a token',
				description: 'Create a new token',
				routing: {
					request: {
						method: 'POST',
						url: '/tokens',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a token',
				description: 'Delete a token permanently',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/tokens/{{$parameter.tokenId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a token',
				description: 'Retrieve a single token by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/tokens/{{$parameter.tokenId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tokens',
				description: 'Retrieve tokens with pagination',
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
				name: 'Get Scopes',
				value: 'getScopes',
				action: 'Get available scopes',
				description: 'Retrieve available token scopes',
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
				name: 'Regenerate',
				value: 'regenerate',
				action: 'Regenerate token',
				description: 'Regenerate an existing token token',
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
				action: 'Update a token',
				description: 'Update a token\'s properties',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/tokens/{{$parameter.tokenId}}',
					},
				},
			},
		],
		default: 'create',
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
			operation: ['delete', 'get', 'regenerate', 'update'],
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
