import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['create'],
	resource: ['webhook'],
};

export const webhookCreateDescription: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
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
		required: true,
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
		required: true,
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
		required: true,
		default: 'explicit',
		options: [
			{ name: 'Explicit', value: 'explicit' },
			{ name: 'All_events', value: 'all_events' },
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
		required: true,
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
];
