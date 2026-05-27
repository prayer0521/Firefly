/**
 * Cloudflare Pages Function — OAuth 授权入口
 * GET /api/oauth/auth?provider=github
 */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");

  if (provider !== "github") {
    return new Response("Unsupported provider", { status: 400 });
  }

  const clientId = env.GITHUB_CLIENT_ID || "Ov23li0EypO9Ufnf30sI";
  const redirectUri =
    env.GITHUB_REDIRECT_URI ||
    `${url.origin}/api/oauth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo",
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
