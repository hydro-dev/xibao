import { Context, Schema } from 'hydrooj';

export const name = 'errorpage-theme';
export const Config = Schema.intersect([
    Schema.object({
        theme: Schema.union(['xibao', 'cloudflare']).default('cloudflare'),
    }),
    Schema.union([
        Schema.object({
            theme: Schema.const('xibao'),
        }),
        Schema.object({
            theme: Schema.const('cloudflare'),
            by: Schema.string().default('Cloudflare'),
            url: Schema.string().role('url').default('https://www.cloudflare.com'),
            location: Schema.string().default('San Francisco'),
        }),
    ] as const),
]);

export function apply(ctx: Context, config: ReturnType<typeof Config>) {
    return ctx.on('handler/error', (h, e) => {
        if (!(e instanceof Error)) return;
        (e as any)._theme = config.theme;
        if (config.theme !== 'cloudflare') return;
        Object.assign(e, {
            _by: config.by,
            _url: config.url,
            _location: config.location,
        });
    });
}
