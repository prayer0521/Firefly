/**
 * Cloudflare Worker — OAuth callback handler for Decap CMS
 * Handles GitHub OAuth flow: /api/oauth/auth  and  /api/oauth/callback
 */

const CLIENT_ID = "Ov23li0EypO9Ufnf30sI";
const CLIENT_SECRET = "b2a6b7d2709635e8c609a68756e3a101d5fc6f5d";
const REDIRECT_URI = "https://prayer.venture0521.workers.dev/api/oauth/callback";
const AUTH_URL = "https://github.com/login/oauth/authorize";
const TOKEN_URL = "https://github.com/login/oauth/access_token";

async function handleAuth(request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");

  if (provider !== "github") {
    return new Response("Unsupported provider", { status: 400 });
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "repo",
  });

  return Response.redirect(`${AUTH_URL}?${params}`, 302);
}

async function handleCallback(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  const tokenResp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = (await tokenResp.json());

  if (data.error) {
    return new Response(
      `OAuth error: ${data.error_description || data.error}`,
      { status: 400 }
    );
  }

  // Post token back to Decap CMS via postMessage
  const html = `<!doctype html>
<html><head><script>
  window.opener.postMessage(
    { token: "${data.access_token}", provider: "github" },
    window.opener.location.origin
  );
</script></head>
<body><p>授权成功！正在跳转...</p></body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/oauth/auth") {
      return handleAuth(request);
    }
    if (url.pathname === "/api/oauth/callback") {
      return handleCallback(request);
    }

    // All other requests: serve static assets
    return env.ASSETS.fetch(request);
  },
};
