import type { INodeProperties } from 'n8n-workflow';
import { collectionAddItemDescription } from './addItem';
import { collectionCreateDescription } from './create';
import { collectionGetAllDescription } from './getAll';
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
				name: 'Add Item',
				value: 'addItem',
				action: 'Add an item to collection',
				description: 'Add a save to a collection',
				routing: {
					request: {
						method: 'POST',
						url: '=/collections/{{$parameter.collectionId}}/items',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a collection',
				description: 'Create a new collection',
				routing: {
					request: {
						method: 'POST',
						url: '/collections',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a collection',
				description: 'Delete a collection permanently',
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
				action: 'Remove an item from collection',
				description: 'Remove a save from a collection',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/collections/{{$parameter.collectionId}}/items/{{$parameter.itemId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a collection',
				description: 'Retrieve a single collection by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/collections/{{$parameter.collectionId}}',
					},
				},
			},
			{
				name: 'Get Item',
				value: 'getItem',
				action: 'Get an item',
				description: 'Retrieve a single item from a collection',
				routing: {
					request: {
						method: 'GET',
						url: '=/collections/{{$parameter.collectionId}}/items/{{$parameter.itemId}}',
					},
				},
			},
			{
				name: 'Get Items',
				value: 'getItems',
				action: 'Get items',
				description: 'Retrieve all items in a collection',
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
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many collections',
				description: 'Retrieve many collections with pagination',
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
				name: 'Update',
				value: 'update',
				action: 'Update a collection',
				description: 'Update a collection\'s properties',
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
				action: 'Update an item in collection',
				description: 'Reorder or change a note on a collection item',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/collections/{{$parameter.collectionId}}/items/{{$parameter.itemId}}',
					},
				},
			},
		],
		default: 'addItem',
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
			operation: ['addItem', 'delete', 'deleteItem', 'get', 'getItem', 'getItems', 'update', 'updateItem'],
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
			operation: ['deleteItem', 'getItem', 'updateItem'],
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
	default: 50,
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
	default: 50,
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
	...collectionAddItemDescription,
	...collectionCreateDescription,
	...collectionGetAllDescription,
	...collectionUpdateDescription,
	...collectionUpdateItemDescription,
];
