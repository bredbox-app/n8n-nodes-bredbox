import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	resource: ['authorization'],
};

export const authorizationDescription: INodeProperties[] = [
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
				action: 'Disconnect authorization',
				description: 'Disconnect a connected authorization',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/authorizations/{{$parameter.authorizationId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many authorizations',
				description: 'Get a paginated list of connected authorizations',
				routing: {
					request: {
						method: 'GET',
						url: '/authorizations',
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
		],
		default: 'getAll',
	},
	{
		displayName: 'Authorization ID',
		name: 'authorizationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['authorization'],
				operation: ['delete'],
			},
		},
		description: 'ID of the authorization to disconnect',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['authorization'],
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
				resource: ['authorization'],
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
