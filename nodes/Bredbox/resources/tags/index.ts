import type { INodeProperties } from 'n8n-workflow';

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
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tags',
				description: 'Get a paginated list of many tags',
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
				description: 'Get all saves with a specific tag',
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
		],
		default: 'getAll',
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
				operation: ['getSaves'],
			},
		},
		description: 'Name of the tag to get saves for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['getAll', 'getSaves'],
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
						pageSize: 1000,
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
				resource: ['tag'],
				operation: ['getAll', 'getSaves'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
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
