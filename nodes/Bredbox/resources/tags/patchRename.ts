import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['patchRename'],
	resource: ['tag'],
};

export const tagPatchRenameDescription: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
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
		displayName: 'Merge',
		name: 'merge',
		type: 'boolean',
		default: false,
		description: 'Whether to merge',
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'merge',
			},
		},
	},
];
