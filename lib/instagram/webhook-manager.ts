const GRAPH_API_URL = 'https://graph.facebook.com/v19.0';

interface WebhookSubscription {
    object: string;
    callback_url: string;
    verify_token: string;
    fields: string[];
}

export class WebhookManager {
    /**
     * Subscribe to Instagram webhooks for a given page/app
     * @param pageAccessToken The Page Access Token (not User token)
     * @param appId Instagram App ID
     */
    async subscribeWebhooks(
        pageAccessToken: string,
        appId: string,
        callbackUrl: string,
        verifyToken: string
    ) {
        const fields = [
            'comments',
            'mentions',
            'story_insights',
            'live_comments',
        ];

        const url = `${GRAPH_API_URL}/${appId}/subscriptions`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                object: 'instagram',
                callback_url: callbackUrl,
                verify_token: verifyToken,
                fields: fields.join(','),
                access_token: pageAccessToken,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to subscribe webhooks');
        }

        return data;
    }

    /**
     * List active webhook subscriptions
     */
    async listSubscriptions(appId: string, appAccessToken: string) {
        const url = `${GRAPH_API_URL}/${appId}/subscriptions?access_token=${appAccessToken}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to list subscriptions');
        }

        return data;
    }

    /**
     * Delete webhook subscription
     */
    async deleteSubscription(appId: string, appAccessToken: string, object: string = 'instagram') {
        const url = `${GRAPH_API_URL}/${appId}/subscriptions?object=${object}&access_token=${appAccessToken}`;

        const response = await fetch(url, { method: 'DELETE' });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to delete subscription');
        }

        return data;
    }
}
