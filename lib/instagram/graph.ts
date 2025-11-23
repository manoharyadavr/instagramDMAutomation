const GRAPH_API_URL = 'https://graph.facebook.com/v19.0';

interface InstagramConfig {
    accessToken: string;
    instagramId: string; // The IG Business Account ID
}

export class InstagramClient {
    private accessToken: string;
    private instagramId: string;

    constructor(config: InstagramConfig) {
        this.accessToken = config.accessToken;
        this.instagramId = config.instagramId;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${GRAPH_API_URL}/${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Instagram API Error: ${data.error?.message || response.statusText}`);
        }

        return data;
    }

    async getProfile() {
        return this.request(`${this.instagramId}?fields=id,username,name,profile_picture_url`);
    }

    async checkFollow(targetUsername: string): Promise<boolean> {
        // Note: The API doesn't have a direct "check if X follows me" for IG Business accounts easily 
        // without iterating followers or using specific endpoints that might be restricted.
        // However, for "Basic Display" it's different. For "Graph API" (Business), 
        // we usually can't easily check if a *random* user follows us unless we have their ID.
        // But if we have the user's scoped ID (from a webhook interaction), we might be able to check.
        // A common workaround is to try to get the relationship status if allowed, or assume true for MVP if restricted.
        // CORRECT APPROACH: Use the `business_discovery` endpoint to get data about the user if possible, 
        // or if we have the user's ID, check `/me/followers` (but that's paginated and heavy).
        // ACTUALLY: There isn't a simple "does X follow me" endpoint in the official Graph API for IG Business 
        // that is efficient for high volume. 
        // Many automations use the "follower_count" or just skip this check if strict API compliance is needed.
        // HOWEVER, if the user interacts with us, we get their ID.
        // We will implement a placeholder that returns true for now, or a "best effort" if we find a valid endpoint.
        // Let's stick to a mock implementation for the "check" as it's complex and often requires specific permissions.
        // Real implementation would involve: GET /{ig-user-id}?fields=business_discovery.username({targetUsername}){follows_count} (not quite).

        // For this system, we will assume we can't strictly enforce it without extra permissions or a private API (which we avoid).
        // We'll return true to allow the automation to proceed, or log a warning.
        return true;
    }

    async replyToComment(commentId: string, message: string) {
        return this.request(`${commentId}/replies`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    }

    async sendDM(recipientId: string, message: string) {
        // Note: Sending DMs requires the 'instagram_manage_messages' permission.
        // We use the /messages endpoint.
        return this.request(`${this.instagramId}/messages`, {
            method: 'POST',
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: { text: message },
            }),
        });
    }

    async getMedia(mediaId: string) {
        return this.request(`${mediaId}?fields=id,caption,media_type,media_url,permalink`);
    }
}
