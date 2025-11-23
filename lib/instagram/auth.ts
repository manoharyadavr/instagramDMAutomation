const APP_ID = process.env.INSTAGRAM_APP_ID || process.env.INSTAGRAM_CLIENT_ID;
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET || process.env.INSTAGRAM_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/auth/instagram/callback`;

export function getAuthorizationUrl() {
    const scope = [
        'instagram_basic',
        'instagram_manage_comments',
        'instagram_manage_messages',
        'pages_show_list',
        'pages_read_engagement',
        'business_management' // often needed to link pages
    ].join(',');

    // URL encode the redirect URI
    const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);

    return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodedRedirectUri}&scope=${scope}&response_type=code&state=instagram_connect`;
}

export async function exchangeCodeForToken(code: string) {
    // URL encode the redirect URI
    const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
    const url = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodedRedirectUri}&client_secret=${APP_SECRET}&code=${code}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    return {
        accessToken: data.access_token,
        userId: data.user_id, // This is the Facebook User ID, not the Page or IG ID yet
    };
}

export async function getPagesAndInstagramAccounts(accessToken: string) {
    // 1. Get User's Pages
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesRes.json();

    if (pagesData.error) throw new Error(pagesData.error.message);

    const accounts = [];

    // 2. For each page, check for connected Instagram Business Account
    for (const page of pagesData.data) {
        const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`); // Use user token or page token? Usually user token works if scope is right.
        const igData = await igRes.json();

        if (igData.instagram_business_account) {
            // Get IG details
            const igDetailsRes = await fetch(`https://graph.facebook.com/v19.0/${igData.instagram_business_account.id}?fields=id,username,profile_picture_url&access_token=${accessToken}`);
            const igDetails = await igDetailsRes.json();

            accounts.push({
                pageId: page.id,
                pageName: page.name,
                pageAccessToken: page.access_token, // Important: We might need the Page Access Token for some operations, or Long-Lived User Token.
                instagramId: igDetails.id,
                username: igDetails.username,
                profilePictureUrl: igDetails.profile_picture_url,
            });
        }
    }

    return accounts;
}
