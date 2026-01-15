import { Hono } from "hono";
import type { Env } from './core-utils';
import { ShareEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { ShareFile, ShareMetadata, ShareState } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Create Share
  app.post('/api/shares', async (c) => {
    const { metadata, files } = (await c.req.json()) as { metadata: Partial<ShareMetadata>, files: ShareFile[] };
    if (!files?.length) return bad(c, 'No files provided');
    if (!files[0]?.path) return bad(c, 'Invalid files provided');
    const id = metadata.id || crypto.randomUUID();
    const isWebsite = files.some(f => f.path.toLowerCase() === 'index.html');
    const shareData: ShareState = {
      id,
      title: metadata.title || 'My Sketch',
      createdAt: Date.now(),
      fileCount: 0,
      totalSize: 0,
      isWebsite,
      mainFile: isWebsite ? 'index.html' : files[0].path,
      filePaths: [],
      files: {}
    };
    await ShareEntity.create(c.env, shareData);
    const entity = new ShareEntity(c.env, id);
    await entity.uploadFiles(files);
    return ok(c, { id });
  });
  // Get Shares (with optional filter)
  app.get('/api/shares', async (c) => {
    const idsParam = c.req.query('ids');
    if (idsParam) {
      const ids = idsParam.split(',').filter(Boolean);
      const items = await Promise.all(ids.map(async (id) => {
        const entity = new ShareEntity(c.env, id);
        if (await entity.exists()) {
          const state = await entity.getState();
          const { files, ...meta } = state;
          return meta;
        }
        return null;
      }));
      return ok(c, { items: items.filter(Boolean), next: null });
    }
    const page = await ShareEntity.list(c.env);
    const metaItems = page.items.map(item => {
      const { files, ...meta } = item;
      return meta;
    });
    return ok(c, { items: metaItems, next: page.next });
  });
  // Get Share Metadata
  app.get('/api/shares/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new ShareEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Share not found');
    const state = await entity.getState();
    const { files, ...meta } = state;
    return ok(c, meta);
  });
  // Delete Share
  app.delete('/api/shares/:id', async (c) => {
    const id = c.req.param('id');
    const existed = await ShareEntity.delete(c.env, id);
    if (!existed) return notFound(c, 'Share not found');
    return ok(c, { deleted: true });
  });
  // Raw Content Serving
  app.get('/api/content/:id/:path{.+}', async (c) => {
    const id = c.req.param('id');
    const path = c.req.param('path');
    const entity = new ShareEntity(c.env, id);
    if (!await entity.exists()) return new Response('Not Found', { status: 404 });
    const file = await entity.getFile(path);
    if (!file) return new Response('File Not Found', { status: 404 });
    const binary = Uint8Array.from(atob(file.content), char => char.charCodeAt(0));
    return new Response(binary, {
      headers: {
        'Content-Type': file.type,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  });
}