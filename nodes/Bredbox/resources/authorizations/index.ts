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
				action: 'Delete a authorization',
				description: 'Delete a authorization permanently',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/authorizations/{{$parameter.applicationId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many authorizations',
				description: 'Retrieve authorizations with pagination',
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
		default: 'delete',
	},
	{
	displayName: 'Application ID',
	name: 'applicationId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['authorization'],
			operation: ['delete'],
		},
	},
	description: 'Application ID of the authorization',
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['authorization'],
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
			resource: ['authorization'],
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
