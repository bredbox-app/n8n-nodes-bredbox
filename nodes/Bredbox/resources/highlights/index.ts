import type { INodeProperties } from 'n8n-workflow';
import { highlightCreateDescription } from './create';


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
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many highlights',
				description: 'Retrieve many highlights with pagination',
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
			{
				name: 'Create',
				value: 'create',
				action: 'Create a highlight',
				description: 'Create a new highlight',
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
				description: 'Delete a highlight permanently',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/saves/{{$parameter.saveId}}/highlights/{{$parameter.highlightId}}',
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
	description: 'Save ID of the highlight',
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
	description: 'Highlight ID of the highlight',
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['highlight'],
			operation: ['getAll'],
		},
	},
	description: 'Whether to return all results or only up to a given limit',
	routing: {
		send: {
			paginate: '={{ $value }}',
		},
		operations: {
			pagination: {
				type: 'offset',
				properties: {
					limitParameter: 'per_page',
					offsetParameter: 'page',
					pageSize: 30,
					type: 'query',
				},
			},
		},
	},
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	displayOptions: {
		show: {
			resource: ['highlight'],
			operation: ['getAll'],
		},
	},
	description: 'Max number of results to return',
	typeOptions: {
		minValue: 1,
	},
	routing: {
		send: {
			type: 'query',
			property: 'per_page',
		},
	},
},
	...highlightCreateDescription,
];
