import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class BredboxApi implements ICredentialType {
	name = 'bredboxApi';

	displayName = 'Bredbox API';

	icon: Icon = 'file:../nodes/Bredbox/bredbox.svg';

	documentationUrl = 'https://github.com/bredbox-app/n8n-nodes-bredbox?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.bredbox.app/v2',
			url: '/me',
			method: 'GET',
		},
	};
}
