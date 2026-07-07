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
				action: 'Create a export',
				description: 'Create a new export',
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
				description: 'Retrieve many exports with pagination',
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
		default: 'create',
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
	description: 'Export ID of the export',
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['export'],
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
	default: 50,
	displayOptions: {
		show: {
			resource: ['export'],
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
