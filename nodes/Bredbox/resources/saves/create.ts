import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['create'],
	resource: ['save'],
};

export const saveCreateDescription: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'url',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Content ID',
		name: 'content_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'content_id',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'title',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'HTML',
		name: 'html',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'html',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: [],
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'tags',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
	{
		displayName: 'Background',
		name: 'background',
		type: 'boolean',
		default: false,
		description: 'Whether to background',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'background',
				value: '={{$value ? $value : undefined}}',
			},
		},
	},
];
