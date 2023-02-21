import { resolve } from 'path';
import { Handlebars } from 'https://deno.land/x/handlebars@v0.9.0/mod.ts';

interface RenderViewParams {
  viewName: string;
  data: Record<string, unknown>;
  // deno-lint-ignore no-explicit-any
  helpers?: Record<string, (input: any) => string>;
}

export const renderView = (params: RenderViewParams): Promise<string> => {
  const handle = new Handlebars({
    baseDir: resolve('.', 'src/views'),
    extname: '.hbs',
    layoutsDir: 'layouts',
    partialsDir: 'partials',
    cachePartials: false,
    defaultLayout: 'main',
    helpers: params.helpers,
    compilerOptions: undefined,
  });

  return handle.renderView(params.viewName, params.data);
};
