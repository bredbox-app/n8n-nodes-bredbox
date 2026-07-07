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
				name: 'Get Many',
				value: 'getAll',
				action: 'List user exports with pagination',
				description: 'Returns the authenticated user\'s exports ordered by creation date. Includes download links for ready exports.',
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
			{
				name: 'Download',
				value: 'download',
				action: 'Download a user export archive',
				description: 'Download a ready export as a ZIP file. Requires authentication and ownership of the export.',
				routing: {
					request: {
						method: 'GET',
						url: '=/exports/{{$parameter.exportId}}/download',
						encoding: 'arraybuffer',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new data export',
				description: 'Initiate a full data export (saves, collections, and tags). Rate limited to one export per 24 hours.',
				routing: {
					request: {
						method: 'POST',
						url: '/exports',
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
	default: 30,
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
