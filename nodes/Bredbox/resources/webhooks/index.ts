import type { INodeProperties } from 'n8n-workflow';
import { webhookCreateDescription } from './create';
import { webhookUpdateDescription } from './update';


const showOnlyFor = {
	resource: ['webhook'],
};

export const webhookDescription: INodeProperties[] = [
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
				action: 'List webhooks',
				description: 'Returns a paginated list of webhooks owned by the authenticated user. Requires `webhooks:read` scope and the `developer` entitlement.',
				routing: {
					request: {
						method: 'GET',
						url: '/webhooks',
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
				name: 'Get',
				value: 'get',
				action: 'Get a webhook by ID',
				description: 'Returns one webhook owned by the authenticated user, including the 10 most recent delivery attempts. Requires `webhooks:read` scope and the `developer` entitlement.',
				routing: {
					request: {
						method: 'GET',
						url: '=/webhooks/{{$parameter.webhookId}}',
					},
				},
			},
			{
				name: 'Get Events',
				value: 'getEvents',
				action: 'List available webhook event types',
				description: 'Returns the stable v1 webhook event catalog used for outbound deliveries. Requires `webhooks:read` scope and the `developer` entitlement.',
				routing: {
					request: {
						method: 'GET',
						url: '/webhooks/events',
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
				name: 'Create',
				value: 'create',
				action: 'Create webhook',
				description: 'Creates a webhook for the authenticated user. Requires `webhooks:write` scope and the `developer` entitlement.',
				routing: {
					request: {
						method: 'POST',
						url: '/webhooks',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a webhook',
				description: 'Updates mutable webhook fields (including status for enable/disable). Requires `webhooks:write` scope and the `developer` entitlement.',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/webhooks/{{$parameter.webhookId}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a webhook',
				description: 'Deletes a webhook owned by the authenticated user.',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/webhooks/{{$parameter.webhookId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
	displayName: 'Webhook ID',
	name: 'webhookId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['get', 'update', 'delete'],
		},
	},
	description: 'Webhook ID of the webhook',
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['webhook'],
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
			resource: ['webhook'],
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
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['getEvents'],
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
			resource: ['webhook'],
			operation: ['getEvents'],
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
	...webhookCreateDescription,
	...webhookUpdateDescription,
];
