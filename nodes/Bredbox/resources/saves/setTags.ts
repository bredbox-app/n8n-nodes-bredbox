import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['setTags'],
	resource: ['save'],
};

export const saveSetTagsDescription: INodeProperties[] = [
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		required: true,
		default: [],
		description: 'The save\'s new tags, replacing all of its current tags. An empty array removes every tag.',
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
];
