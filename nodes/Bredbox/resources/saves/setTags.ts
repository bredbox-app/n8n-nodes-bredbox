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
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: [],
		displayOptions: {
			show: showOnlyFor,
		},
		description: 'Tags to set on the save (replaces all existing tags)',
		routing: {
			send: {
				type: 'body',
				property: 'tags',
			},
		},
	},
];
