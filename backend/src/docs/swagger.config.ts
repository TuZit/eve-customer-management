import { SwaggerCustomOptions } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

interface ISwaggerConfig {
  title: string;
  description: string;
  version: string;
  apiKey: SecuritySchemeObject;
  apiKeyName: string;
}

export const SWAGGER_CONFIG: ISwaggerConfig = {
  title: 'Evẻon',
  description: 'Evẻon API doc',
  version: 'neutral',
  apiKey: {
    type: 'apiKey',
    name: 'Authorization-Url-Params',
    description: 'enter token',
  },
  apiKeyName: 'token',
};

export const swaggerOptions: SwaggerCustomOptions = {
  customSiteTitle: 'App API Document',
};
