import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['update'],
	resource: ['collection'],
};

export const collectionUpdateDescription: INodeProperties[] = [
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
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'description',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
