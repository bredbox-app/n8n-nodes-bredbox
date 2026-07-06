import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	resource: ['export'],
};

export const exportDescription: INodeProperties[] = [
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
				action: 'Create an export',
				description: 'Request a new data export',
				routing: {
					request: {
						method: 'POST',
						url: '/exports',
					},
				},
			},
			{
				name: 'Download',
				value: 'download',
				action: 'Download export',
				description: 'Download a completed export archive',
				routing: {
					request: {
						method: 'GET',
						url: '=/exports/{{$parameter.exportId}}/download',
						encoding: 'arraybuffer',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many exports',
				description: 'Get a paginated list of exports',
				routing: {
					request: {
						method: 'GET',
						url: '/exports',
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
		displayName: 'Export ID',
		name: 'exportId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['download'],
			},
		},
		description: 'ID of the export to download',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['export'],
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
				resource: ['export'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 30,
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
