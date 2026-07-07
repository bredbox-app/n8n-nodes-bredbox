import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['getAll'],
	resource: ['collection'],
};

export const collectionGetAllDescription: INodeProperties[] = [
	{
		displayName: 'Save ID',
		name: 'save_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'save_id',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
