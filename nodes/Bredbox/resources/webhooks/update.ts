import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['update'],
	resource: ['webhook'],
};

export const webhookUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'name',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'url',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Secret',
		name: 'secret',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'secret',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Subscription Mode',
		name: 'subscription_mode',
		type: 'options',
		default: 'explicit',
		options: [
			{ name: 'All Events', value: 'all_events' },
			{ name: 'Explicit', value: 'explicit' },
		],
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'subscription_mode',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Event Types',
		name: 'event_types',
		type: 'string',
		default: [],
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'event_types',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'active',
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Disabled', value: 'disabled' },
		],
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'status',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
