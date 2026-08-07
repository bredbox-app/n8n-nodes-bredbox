import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['postTagsAdd'],
	resource: ['save'],
};

export const savePostTagsAddDescription: INodeProperties[] = [
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: [],
		description: 'Add tags to a specific save by ID',
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
