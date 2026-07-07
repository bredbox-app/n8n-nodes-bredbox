import type { INodeProperties } from 'n8n-workflow';
import { meConfirmPrivacyDescription } from './confirmPrivacy';


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
				name: 'Get Profile',
				value: 'getProfile',
				action: 'Get profile',
				description: 'Retrieve the current user profile',
				routing: {
					request: {
						method: 'GET',
						url: '/me',
					},
				},
			},
			{
				name: 'Get Job',
				value: 'getJob',
				action: 'Get job status',
				description: 'Retrieve the status of a background job',
				routing: {
					request: {
						method: 'GET',
						url: '=/me/jobs/{{$parameter.jobId}}',
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
				description: 'Request deletion of the user account',
				routing: {
					request: {
						method: 'DELETE',
						url: '/me',
					},
				},
			},
			{
				name: 'Clear Data',
				value: 'clearData',
				action: 'Clear all user data',
				description: 'Request deletion of all user data',
				routing: {
					request: {
						method: 'DELETE',
						url: '/me/data',
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
	description: 'Job ID of the me',
},
	...meConfirmPrivacyDescription,
];
