import type { INodeProperties } from 'n8n-workflow';

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
				action: 'Add item to collection',
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
				description: 'Delete a collection by ID',
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
				action: 'Remove item from collection',
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
				description: 'Get a single collection by ID',
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
				action: 'Get a collection item',
				description: 'Get a single item from a collection',
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
				action: 'Get collection items',
				description: 'Get all items in a collection',
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
				description: 'Get a paginated list of collections',
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
				description: 'Update a collection name or description',
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
				action: 'Update a collection item',
				description: 'Reorder or change note on a collection item',
				routing: {
					request: {
						method: 'PATCH',
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
				operation: ['get', 'update', 'delete', 'getItems', 'addItem', 'getItem', 'updateItem', 'deleteItem'],
			},
		},
		description: 'ID of the collection',
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
		description: 'ID of the collection item',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create'],
			},
		},
		description: 'Name of the collection (max 100 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create'],
			},
		},
		description: 'Description of the collection (max 200 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'description',
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['update'],
			},
		},
		description: 'New name for the collection (max 100 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['update'],
			},
		},
		description: 'New description for the collection (max 200 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'description',
			},
		},
	},
	{
		displayName: 'Save ID',
		name: 'user_save_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['addItem'],
			},
		},
		description: 'ID of the save to add to the collection',
		routing: {
			send: {
				type: 'body',
				property: 'user_save_id',
			},
		},
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['addItem'],
			},
		},
		description: 'Optional note for the item (max 300 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'note',
			},
		},
	},
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		options: [
			{ name: 'Up', value: 'up' },
			{ name: 'Down', value: 'down' },
		],
		default: 'down',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['updateItem'],
			},
		},
		description: 'Direction to move the item',
		routing: {
			send: {
				type: 'body',
				property: 'direction',
			},
		},
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['updateItem'],
			},
		},
		description: 'New note for the item (max 300 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'note',
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['getAll'],
			},
		},
		default: false,
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
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		routing: {
			send: {
				type: 'query',
				property: 'per_page',
				value: '={{ $value }}',
			},
			output: {
				maxResults: '={{ $value }}',
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Save ID Filter',
		name: 'save_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['getAll'],
			},
		},
		description: 'Filter to only collections containing this save ID',
		routing: {
			send: {
				type: 'query',
				property: 'save_id',
			},
		},
	},
];
