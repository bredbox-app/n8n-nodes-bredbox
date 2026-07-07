import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['getAll'],
	resource: ['save'],
};

export const saveGetAllDescription: INodeProperties[] = [
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		default: 'all',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'filter',
			},
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'query',
				property: 'type',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
