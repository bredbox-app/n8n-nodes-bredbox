import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	resource: ['import'],
};

export const importDescription: INodeProperties[] = [
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
				action: 'Create an import',
				description: 'Import bookmarks from a file',
				routing: {
					request: {
						method: 'POST',
						url: '/imports',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many imports',
				description: 'Get a paginated list of imports',
				routing: {
					request: {
						method: 'GET',
						url: '/imports',
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
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['import'],
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
				resource: ['import'],
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
	{
		displayName: 'Input Data Field Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['create'],
			},
		},
		description: 'Name of the binary property containing the file to import (Pocket CSV, Bookmarks HTML, Plain Text, or Instapaper CSV)',
	},
];
