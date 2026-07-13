import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['update'],
	resource: ['highlight'],
};

export const highlightUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Start Path',
		name: 'start_path',
		type: 'json',
		required: true,
		default: {},
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'start_path',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Start Offset',
		name: 'start_offset',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'start_offset',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'End Path',
		name: 'end_path',
		type: 'json',
		required: true,
		default: {},
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'end_path',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'End Offset',
		name: 'end_offset',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'end_offset',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
