import { NextResponse } from 'next/server';

/**
 * GET /api/docs
 *
 * Swagger UI servi en HTML statique depuis le CDN unpkg.
 * Aucune dépendance npm supplémentaire requise.
 * La spec est chargée depuis /api/docs/swagger.json (même origine → pas de CORS).
 */
export function GET() {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fundee API — Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #fafafa; }
    #swagger-ui .topbar { background: #1a1a2e; }
    #swagger-ui .topbar-wrapper img { display: none; }
    #swagger-ui .topbar-wrapper::before {
      content: "Fundee API";
      color: #fff;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      padding-left: 1rem;
    }
    #swagger-ui .info .title { color: #1a1a2e; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.onload = function () {
      SwaggerUIBundle({
        url: "/api/docs/swagger.json",
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout",
        deepLinking: true,
        displayRequestDuration: true,
        tryItOutEnabled: true,
        persistAuthorization: true,
        filter: true,
        syntaxHighlight: { activate: true, theme: "agate" },
      });
    };
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
