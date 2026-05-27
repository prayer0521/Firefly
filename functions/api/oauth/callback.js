/**
 * Cloudflare Pages Function — OAuth 回调处理
 * GET /api/oauth/callback?code=...
 * 用 code 换取 access_token，返回 HTML 将 token 传给 Decap CMS
 */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  const clientId = env.GITHUB_CLIENT_ID || "Ov23li0EypO9Ufnf30sI";
  const clientSecret =
    env.GITHUB_CLIENT_SECRET || "b2a6b7d2709635e8c609a68756e3a101d5fc6f5d";
  const redirectUri =
    env.GITHUB_REDIRECT_URI ||
    `${url.origin}/api/oauth/callback`;

  const tokenResp = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    }
  );

  const data = await tokenResp.json();

  if (data.error) {
    return new Response(
      `OAuth error: ${data.error_description || data.error}`,
      { status: 400 }
    );
  }

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
