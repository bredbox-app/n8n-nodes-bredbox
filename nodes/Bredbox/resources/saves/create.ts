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
		required: true,
		displayOptions: {
			show: showOnlyFor,
		},
		description: 'The URL of the page to save',
		routing: {
			send: {
				type: 'body',
				property: 'url',
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
		description: 'Identifier for an existing piece of content',
		routing: {
			send: {
				type: 'body',
				property: 'content_id',
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
		description: 'Title for the save',
		routing: {
			send: {
				type: 'body',
				property: 'title',
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
		description: 'Raw HTML content to save',
		routing: {
			send: {
				type: 'body',
				property: 'html',
			},
		},
	},
	{
		displayName: 'Background',
		name: 'background',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyFor,
		},
		description: 'Whether to process this save in the background',
		routing: {
			send: {
				type: 'body',
				property: 'background',
			},
		},
	},
];
