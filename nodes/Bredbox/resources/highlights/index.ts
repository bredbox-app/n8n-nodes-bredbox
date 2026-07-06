import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor = {
	resource: ['highlight'],
};

export const highlightDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyFor,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a highlight',
				description: 'Create a highlight on a save',
				routing: {
					request: {
						method: 'POST',
						url: '=/saves/{{$parameter.saveId}}/highlights',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a highlight',
				description: 'Delete a highlight from a save',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/saves/{{$parameter.saveId}}/highlights/{{$parameter.highlightId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many highlights',
				description: 'Get many highlights for a save',
				routing: {
					request: {
						method: 'GET',
						url: '=/saves/{{$parameter.saveId}}/highlights',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'items',
								},
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Save ID',
		name: 'saveId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['getAll', 'create', 'delete'],
			},
		},
		description: 'ID of the save',
	},
	{
		displayName: 'Highlight ID',
		name: 'highlightId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['delete'],
			},
		},
		description: 'ID of the highlight to delete',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['create'],
			},
		},
		description: 'The highlighted text (max 2000 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'text',
			},
		},
	},
	{
		displayName: 'Start Path',
		name: 'start_path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['create'],
			},
		},
		description: 'JSON array of numbers representing the start location path (e.g. [0,1,2])',
		routing: {
			send: {
				type: 'body',
				property: 'start_path',
				value: '={{ JSON.parse($value) }}',
			},
		},
	},
	{
		displayName: 'Start Offset',
		name: 'start_offset',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['create'],
			},
		},
		description: 'Character offset within the start node',
		routing: {
			send: {
				type: 'body',
				property: 'start_offset',
			},
		},
	},
	{
		displayName: 'End Path',
		name: 'end_path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['create'],
			},
		},
		description: 'JSON array of numbers representing the end location path (e.g. [0,1,5])',
		routing: {
			send: {
				type: 'body',
				property: 'end_path',
				value: '={{ JSON.parse($value) }}',
			},
		},
	},
	{
		displayName: 'End Offset',
		name: 'end_offset',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['create'],
			},
		},
		description: 'Character offset within the end node',
		routing: {
			send: {
				type: 'body',
				property: 'end_offset',
			},
		},
	},
];
