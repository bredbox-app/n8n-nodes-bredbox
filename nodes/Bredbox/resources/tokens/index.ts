import type { INodeProperties } from 'n8n-workflow';

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
				description: 'Create a new API access token',
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
				description: 'Revoke an API token',
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
				description: 'Get a single API token by ID',
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
				description: 'Get a paginated list of API tokens',
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
				description: 'Get all available token scopes',
				routing: {
					request: {
						method: 'GET',
						url: '/tokens/scopes',
					},
				},
			},
			{
				name: 'Regenerate',
				value: 'regenerate',
				action: 'Regenerate a token',
				description: 'Regenerate an API token secret',
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
				description: 'Update and regenerate an API token',
				routing: {
					request: {
						method: 'PATCH',
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
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['get', 'update', 'delete', 'regenerate'],
			},
		},
		description: 'ID of the token',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['create'],
			},
		},
		description: 'Name for the token (max 100 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'Scopes',
		name: 'scopes',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['create'],
			},
		},
		description: 'List of scopes for the token (e.g. saves:read, saves:write)',
		routing: {
			send: {
				type: 'body',
				property: 'scopes',
			},
		},
	},
	{
		displayName: 'Expires In Days',
		name: 'expires_in_days',
		type: 'number',
		default: 365,
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['create'],
			},
		},
		description: 'Number of days until the token expires (1-365)',
		routing: {
			send: {
				type: 'body',
				property: 'expires_in_days',
			},
		},
	},
	{
		displayName: 'No Expiration',
		name: 'no_expiration',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['create'],
			},
		},
		description: 'Whether the token should never expire',
		routing: {
			send: {
				type: 'body',
				property: 'no_expiration',
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['update'],
			},
		},
		description: 'New name for the token (max 100 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'Scopes',
		name: 'scopes',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['update'],
			},
		},
		description: 'New list of scopes for the token',
		routing: {
			send: {
				type: 'body',
				property: 'scopes',
			},
		},
	},
	{
		displayName: 'Expires In Days',
		name: 'expires_in_days',
		type: 'number',
		default: 365,
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['update'],
			},
		},
		description: 'Number of days until the token expires (1-365)',
		routing: {
			send: {
				type: 'body',
				property: 'expires_in_days',
			},
		},
	},
	{
		displayName: 'No Expiration',
		name: 'no_expiration',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['update'],
			},
		},
		description: 'Whether the token should never expire',
		routing: {
			send: {
				type: 'body',
				property: 'no_expiration',
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['token'],
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
				resource: ['token'],
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
];
