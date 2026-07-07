import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['update'],
	resource: ['token'],
};

export const tokenUpdateDescription: INodeProperties[] = [
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
		displayName: 'Scopes',
		name: 'scopes',
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
				property: 'scopes',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Expires In Days',
		name: 'expires_in_days',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'expires_in_days',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'No Expiration',
		name: 'no_expiration',
		type: 'boolean',
		default: false,
		description: 'Whether the token has no expiration',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'no_expiration',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
