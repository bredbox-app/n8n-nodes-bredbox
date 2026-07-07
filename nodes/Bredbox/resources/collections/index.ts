import type { INodeProperties } from 'n8n-workflow';
import { collectionGetAllDescription } from './getAll';
import { collectionCreateDescription } from './create';
import { collectionAddItemDescription } from './addItem';
import { collectionUpdateDescription } from './update';
import { collectionUpdateItemDescription } from './updateItem';


const showOnlyFor = {
	resource: ['collection'],
};

export const collectionDescription: INodeProperties[] = [
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
				action: 'List user collections with pagination and optional membership check',
				description: 'List user collections with pagination and optional membership check',
				routing: {
					request: {
						method: 'GET',
						url: '/collections',
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
				name: 'Get',
				value: 'get',
				action: 'Get a single collection owned by the current user',
				description: 'Get a single collection owned by the current user',
				routing: {
					request: {
						method: 'GET',
						url: '=/collections/{{$parameter.collectionId}}',
					},
				},
			},
			{
				name: 'Get Items',
				value: 'getItems',
				action: 'List items in a collection',
				description: 'List items in a collection',
				routing: {
					request: {
						method: 'GET',
						url: '=/collections/{{$parameter.collectionId}}/items',
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
				name: 'Get Item',
				value: 'getItem',
				action: 'Get a single collection item',
				description: 'Get a single collection item',
				routing: {
					request: {
						method: 'GET',
						url: '=/collections/{{$parameter.collectionId}}/items/{{$parameter.itemId}}',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new collection',
				description: 'Create a new collection',
				routing: {
					request: {
						method: 'POST',
						url: '/collections',
					},
				},
			},
			{
				name: 'Add Item',
				value: 'addItem',
				action: 'Add a save to a collection',
				description: 'Add a save to a collection',
				routing: {
					request: {
						method: 'POST',
						url: '=/collections/{{$parameter.collectionId}}/items',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a collection',
				description: 'Update a collection',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/collections/{{$parameter.collectionId}}',
					},
				},
			},
			{
				name: 'Update Item',
				value: 'updateItem',
				action: 'Update a collection item (reorder and/or set note)',
				description: 'Update a collection item (reorder and/or set note)',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/collections/{{$parameter.collectionId}}/items/{{$parameter.itemId}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a collection',
				description: 'Delete a collection',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/collections/{{$parameter.collectionId}}',
					},
				},
			},
			{
				name: 'Delete Item',
				value: 'deleteItem',
				action: 'Remove a save from a collection',
				description: 'Remove a save from a collection',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/collections/{{$parameter.collectionId}}/items/{{$parameter.itemId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
	displayName: 'Collection ID',
	name: 'collectionId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['collection'],
			operation: ['get', 'getItems', 'getItem', 'addItem', 'update', 'updateItem', 'delete', 'deleteItem'],
		},
	},
	description: 'Collection ID of the collection',
},
	{
	displayName: 'Item ID',
	name: 'itemId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['collection'],
			operation: ['getItem', 'updateItem', 'deleteItem'],
		},
	},
	description: 'Item ID of the collection',
},
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['collection'],
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
	default: 30,
	displayOptions: {
		show: {
			resource: ['collection'],
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
	{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			resource: ['collection'],
			operation: ['getItems'],
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
	default: 30,
	displayOptions: {
		show: {
			resource: ['collection'],
			operation: ['getItems'],
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
	...collectionGetAllDescription,
	...collectionCreateDescription,
	...collectionAddItemDescription,
	...collectionUpdateDescription,
	...collectionUpdateItemDescription,
];
