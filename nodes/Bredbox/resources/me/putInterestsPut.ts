import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['putInterestsPut'],
	resource: ['me'],
};

export const mePutInterestsPutDescription: INodeProperties[] = [
	{
		displayName: 'Interests',
		name: 'interests',
		type: 'string',
		default: [],
		description: 'Set current user interests',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			request: {
				body: '={{ $value }}',
			},
		},
	},
];
