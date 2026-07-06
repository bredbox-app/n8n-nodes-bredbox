import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['search'],
	resource: ['save'],
};

export const saveSearchDescription: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		description: 'Full-text search query (minimum 3 characters)',
		routing: {
			send: {
				type: 'query',
				property: 'q',
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: showOnlyFor,
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
		displayOptions: {
			show: {
				...showOnlyFor,
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
