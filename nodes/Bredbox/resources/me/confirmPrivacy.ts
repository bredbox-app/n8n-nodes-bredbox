import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['confirmPrivacy'],
	resource: ['me'],
};

export const meConfirmPrivacyDescription: INodeProperties[] = [
	{
		displayName: 'Token',
		name: 'token',
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
				property: 'token',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
