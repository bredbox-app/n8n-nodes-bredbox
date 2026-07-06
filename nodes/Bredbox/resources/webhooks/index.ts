import type { INodeProperties } from 'n8n-workflow';

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
				description: 'Delete a webhook by ID',
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
				description: 'Get a single webhook by ID with recent deliveries',
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
				description: 'Get all available webhook event types',
				routing: {
					request: {
						method: 'GET',
						url: '/webhooks/events',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many webhooks',
				description: 'Get a paginated list of webhooks',
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
				name: 'Update',
				value: 'update',
				action: 'Update a webhook',
				description: 'Update a webhook configuration',
				routing: {
					request: {
						method: 'PATCH',
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
		description: 'ID of the webhook',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'Name for the webhook (max 100 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'Target URL to send webhook events to',
		routing: {
			send: {
				type: 'body',
				property: 'url',
			},
		},
	},
	{
		displayName: 'Secret',
		name: 'secret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'Secret for verifying webhook payloads (16-256 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'secret',
			},
		},
	},
	{
		displayName: 'Subscription Mode',
		name: 'subscription_mode',
		type: 'options',
		required: true,
		options: [
			{ name: 'Explicit', value: 'explicit', description: 'Only receive specified event types' },
			{ name: 'All Events', value: 'all_events', description: 'Receive all event types' },
		],
		default: 'explicit',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'How events are subscribed',
		routing: {
			send: {
				type: 'body',
				property: 'subscription_mode',
			},
		},
	},
	{
		displayName: 'Event Types',
		name: 'event_types',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'List of event types to subscribe to (e.g. save.created, save.updated)',
		routing: {
			send: {
				type: 'body',
				property: 'event_types',
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		description: 'New name for the webhook (max 100 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		description: 'New target URL for the webhook',
		routing: {
			send: {
				type: 'body',
				property: 'url',
			},
		},
	},
	{
		displayName: 'Secret',
		name: 'secret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		description: 'New secret for verifying webhook payloads (16-256 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'secret',
			},
		},
	},
	{
		displayName: 'Subscription Mode',
		name: 'subscription_mode',
		type: 'options',
		options: [
			{ name: 'Explicit', value: 'explicit' },
			{ name: 'All Events', value: 'all_events' },
		],
		default: 'explicit',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		description: 'How events are subscribed',
		routing: {
			send: {
				type: 'body',
				property: 'subscription_mode',
			},
		},
	},
	{
		displayName: 'Event Types',
		name: 'event_types',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		description: 'List of event types (replaces existing)',
		routing: {
			send: {
				type: 'body',
				property: 'event_types',
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Disabled', value: 'disabled' },
		],
		default: 'active',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		description: 'Enable or disable the webhook',
		routing: {
			send: {
				type: 'body',
				property: 'status',
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['webhook'],
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
				resource: ['webhook'],
				operation: ['getAll'],
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
