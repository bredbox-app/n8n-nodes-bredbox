import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	operation: ['create'],
	resource: ['export'],
};

export const exportCreateDescription: INodeProperties[] = [
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		default: 'pocket_zip',
		description: 'Archive format: pocket_zip (full account data) or bookmarks_html (browser bookmarks document of active saves). Defaults to pocket_zip.',
		options: [
			{ name: 'Bookmarks HTML', value: 'bookmarks_html' },
			{ name: 'Pocket Zip', value: 'pocket_zip' },
		],
		displayOptions: {
			show: showOnlyFor,
		},
		routing: {
			send: {
				type: 'body',
				property: 'format',
			},
		},
	},
];
