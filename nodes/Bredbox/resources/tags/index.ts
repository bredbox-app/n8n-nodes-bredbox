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
				description: 'Retrieve many tags with pagination',
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
				name: 'S',
				value: 'gets',
				action: 'List saves for a specific tag',
				description: 'List saves for a specific tag',
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
			operation: ['gets'],
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
];
