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
				name: 'Create',
				value: 'create',
				action: 'Create a webhook',
				description: 'Create a new webhook',
				routing: {
					request: {
						method: 'POST',
						url: '/webhooks',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a webhook',
				description: 'Delete a webhook permanently',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/webhooks/{{$parameter.webhookId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a webhook',
				description: 'Retrieve a single webhook by ID',
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
				action: 'Get available events',
				description: 'Retrieve available webhook event types',
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
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many webhooks',
				description: 'Retrieve webhooks with pagination',
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
				name: 'Rotate Secret',
				value: 'postRotateSecret',
				action: 'Rotate a webhook secret',
				description: 'Replaces the webhook\'s signing secret with a newly generated `whsec_` secret and returns it. The old secret stops signing deliveries immediately. This is the only response other than create that includes the full `secret`. To set a secret of your own instead, send it as `secret` to PATCH /v2/webhooks/{webhookId}. Requires `webhooks:write` scope and the `developer` entitlement.',
				routing: {
					request: {
						method: 'POST',
						url: '=/webhooks/{{$parameter.webhookId}}/rotate-secret',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a webhook',
				description: 'Update a webhook\'s properties',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/webhooks/{{$parameter.webhookId}}',
					},
				},
			},
		],
		default: 'create',
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
			operation: ['delete', 'get', 'postRotateSecret', 'update'],
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
	...webhookCreateDescription,
	...webhookUpdateDescription,
];
