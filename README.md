# n8n-nodes-bredbox

This is an n8n community node that lets you use [Bredbox](https://bredbox.app) in your n8n workflows.

Bredbox is a read-it-later and knowledge management service that lets you save, organize, annotate, and search web content. With this node you can automate managing saves, collections, highlights, tags, tokens, webhooks, and more directly from your n8n workflows.

**This node requires a [Bredbox Pro](https://bredbox.app/pricing) subscription.**

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

| Resource | Operations |
|---|---|
| Save | Create, Delete, Get, Get Content, Get Many, Get Tags, Search, Set Tags, Update |
| Highlight | Create, Delete, Get Many |
| Import | Create, Get Many |
| Export | Create, Download, Get Many |
| Tag | Get Many, Get Saves |
| Collection | Add Item, Create, Delete, Delete Item, Get, Get Item, Get Items, Get Many, Update, Update Item |
| Me | Clear Data, Confirm Privacy Action, Delete Account, Get Job, Get Profile |
| Token | Create, Delete, Get, Get Many, Get Scopes, Regenerate, Update |
| Webhook | Create, Delete, Get, Get Events, Get Many, Update |
| Authorization | Delete, Get Many |

## Credentials

### Prerequisites

- A [Bredbox](https://bredbox.app) account with a **Pro subscription**.
- An API access token generated from your Bredbox account settings.

### Setup

1. Open a Bredbox node in n8n.
2. Create a new credential of type **Bredbox API**.
3. Paste your access token into the **Access Token** field.
4. Optionally, change the **API Base URL** if you are running a local development instance of the Bredbox API.

## Compatibility

Requires n8n version 1.0 or later. Tested against the Bredbox API v2.

## Usage

You can configure the API base URL on the credential to point to a local Bredbox instance during development. The default is `https://api.bredbox.app/v2`.

To save a URL in a workflow:

1. Add a **Bredbox** node and select your **Bredbox API** credential.
2. Set **Resource** to **Save** and **Operation** to **Create**.
3. Enter the web address in the **URL** field.
4. Connect the node to the rest of your workflow and execute it to create the save.

## Resources

- [Bredbox](https://bredbox.app)
- [Bredbox API documentation](https://api.bredbox.app/v2/docs)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
