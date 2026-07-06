import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	resource: ['me'],
};

export const meDescription: INodeProperties[] = [
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
				name: 'Clear Data',
				value: 'clearData',
				action: 'Clear all user data',
				description: 'Request deletion of all user data (requires email confirmation)',
				routing: {
					request: {
						method: 'DELETE',
						url: '/me/data',
					},
				},
			},
			{
				name: 'Confirm Privacy Action',
				value: 'confirmPrivacy',
				action: 'Confirm privacy action',
				description: 'Confirm a privacy deletion request with a token',
				routing: {
					request: {
						method: 'POST',
						url: '/me/privacy/confirm',
					},
				},
			},
			{
				name: 'Delete Account',
				value: 'deleteAccount',
				action: 'Delete account',
				description: 'Request deletion of the user account (requires email confirmation)',
				routing: {
					request: {
						method: 'DELETE',
						url: '/me',
					},
				},
			},
			{
				name: 'Get Job',
				value: 'getJob',
				action: 'Get background job status',
				description: 'Get the status of a background job by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/me/jobs/{{$parameter.jobId}}',
					},
				},
			},
			{
				name: 'Get Profile',
				value: 'getProfile',
				action: 'Get profile',
				description: 'Get the current user profile',
				routing: {
					request: {
						method: 'GET',
						url: '/me',
					},
				},
			},
		],
		default: 'getProfile',
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['me'],
				operation: ['getJob'],
			},
		},
		description: 'ID of the background job',
	},
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['me'],
				operation: ['confirmPrivacy'],
			},
		},
		description: 'The confirmation token from the email',
		routing: {
			send: {
				type: 'body',
				property: 'token',
			},
		},
	},
];
