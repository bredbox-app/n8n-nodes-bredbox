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
		required: true,
		default: [],
		description: 'The tags to add. Each is trimmed and lowercased, and runs of spaces become one space. A save can have at most 10 tags.',
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
