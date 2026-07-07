import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	resource: ['authorization'],
};

export const authorizationDescription: INodeProperties[] = [
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
				name: 'get_AuthorizationsList',
				value: 'getAuthorizationsList',
				action: 'List connected applications',
				description: 'List connected applications',
				routing: {
					request: {
						method: 'GET',
						url: '/authorizations',
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
				name: 'delete_AuthorizationsDelete',
				value: 'deleteAuthorizationsDelete',
				action: 'Disconnect an application',
				description: 'Disconnect an application',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/authorizations/{{$parameter.applicationId}}',
					},
				},
			},
		],
		default: 'getAuthorizationsList',
	},
	{
	displayName: 'Application ID',
	name: 'applicationId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['authorization'],
			operation: ['deleteAuthorizationsDelete'],
		},
	},
	description: 'Application ID of the authorization',
},
];
