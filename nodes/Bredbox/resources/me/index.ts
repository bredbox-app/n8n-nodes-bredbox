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
				action: 'Get current user profile',
				description: 'Returns account profile fields for the authenticated user. Requires the `user:read` scope and the `read` entitlement.',
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
				action: 'Get background job status',
				description: 'Retrieves the current status of a background job initiated by the user (e.g., account deletion, data clearance).',
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
				action: 'Confirm a privacy deletion request',
				description: 'Confirms a pending privacy request using the raw email token, promotes the job to pending, and enqueues background processing.',
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
				action: 'Delete user account',
				description: 'Requests an email confirmation before deleting the user\'s account and all associated data. Requires the `user:delete` scope. This action is permanent once confirmed.',
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
				description: 'Requests an email confirmation before clearing all user saved data. The account remains active after confirmation.',
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
