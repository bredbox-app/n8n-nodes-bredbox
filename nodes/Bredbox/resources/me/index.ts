import type { INodeProperties } from 'n8n-workflow';
import { meConfirmPrivacyDescription } from './confirmPrivacy';
import { mePutInterestsPutDescription } from './putInterestsPut';
import { mePatchEmailInboundUpdateDescription } from './patchEmailInboundUpdate';
import { mePutPersonalizationPutDescription } from './putPersonalizationPut';


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
				description: 'Request deletion of all user data',
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
				description: 'Request deletion of the user account',
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
				name: 'get_EmailInboundShow',
				value: 'getEmailInboundShow',
				action: 'Get the current user s inbound email address',
				description: 'Returns the authenticated user\'s active inbound email capture address for a purpose, or 404 when none has been generated. Never creates one — use `POST` to generate. Requires the `user:write` scope and the `read` entitlement.',
				routing: {
					request: {
						method: 'GET',
						url: '=/me/emails/inbound/{{$parameter.purpose}}',
					},
				},
			},
			{
				name: 'Interests Get',
				value: 'getInterestsGet',
				action: 'Get current user interests',
				description: 'Returns the authenticated user\'s selected topic interest slugs. Requires the `user:read` scope and the `read` entitlement.',
				routing: {
					request: {
						method: 'GET',
						url: '/me/interests',
					},
				},
			},
			{
				name: 'Interests Put',
				value: 'putInterestsPut',
				action: 'Set current user interests',
				description: 'Replaces the authenticated user\'s selected topic interests. Input is normalized to lowercase and de-duplicated before persistence. Requires the `user:write` scope and the `write` entitlement.',
				routing: {
					request: {
						method: 'PUT',
						url: '/me/interests',
					},
				},
			},
			{
				name: 'patch_EmailInboundUpdate',
				value: 'patchEmailInboundUpdate',
				action: 'Update the current user s inbound email address status',
				description: 'Updates the status of the authenticated user\'s inbound email capture address between active and disabled. Requires the `user:write` scope and the `write` entitlement, so a read-only account is refused.',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/me/emails/inbound/{{$parameter.purpose}}',
					},
				},
			},
			{
				name: 'Personalization Get',
				value: 'getPersonalizationGet',
				action: 'Get current user personalization setting',
				description: 'Returns whether Bredbox may generate personalized recommendations for the authenticated user. Requires the `user:read` scope and the `read` entitlement.',
				routing: {
					request: {
						method: 'GET',
						url: '/me/personalization',
					},
				},
			},
			{
				name: 'Personalization Put',
				value: 'putPersonalizationPut',
				action: 'Set current user personalization setting',
				description: 'Turns personalized recommendations on or off for the authenticated user. Selected topics and hidden recommendations are retained either way. Requires the `user:write` scope and the `read` entitlement.',
				routing: {
					request: {
						method: 'PUT',
						url: '/me/personalization',
					},
				},
			},
			{
				name: 'post_EmailInboundCreate',
				value: 'postEmailInboundCreate',
				action: 'Generate the current user s inbound email address',
				description: 'Generates an inbound email capture address for the authenticated user, or returns the existing one. Responds 201 when an address was created and 200 when one already existed. Requires the `user:write` scope and the `write` entitlement, so a read-only account is refused.',
				routing: {
					request: {
						method: 'POST',
						url: '=/me/emails/inbound/{{$parameter.purpose}}',
					},
				},
			},
		],
		default: 'clearData',
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
	{
	displayName: 'Purpose',
	name: 'purpose',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['me'],
			operation: ['getEmailInboundShow', 'patchEmailInboundUpdate', 'postEmailInboundCreate'],
		},
	},
	description: 'Purpose of the me',
},
	...meConfirmPrivacyDescription,
	...mePutInterestsPutDescription,
	...mePatchEmailInboundUpdateDescription,
	...mePutPersonalizationPutDescription,
];
