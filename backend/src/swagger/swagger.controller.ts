import { Controller, Get, Header, Redirect } from '@nestjs/common';
import { openApiDocument } from './openapi-document';

@Controller()
export class SwaggerController {
  @Get('openapi.json')
  getOpenApiDocument() {
    return openApiDocument;
  }

  @Get('docs')
  @Redirect('/api-docs', 302)
  redirectDocs() {
    return;
  }

  @Get('api-docs')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getSwaggerUi() {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dealer Management API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #f7f7f7; }
      .swagger-ui .topbar { display: none; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = function () {
        window.ui = SwaggerUIBundle({
          url: '/openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          displayRequestDuration: true
        });
      };
    </script>
  </body>
</html>`;
  }
}
