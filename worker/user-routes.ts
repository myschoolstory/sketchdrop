import { Hono } from "hono";
import type { Env } from './core-utils';
import { ShareEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { ShareFile, ShareMetadata } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Create Share
  app.post('/api/shares', async (c) => {
    const { metadata, files } = (await c.req.json()) as { metadata: Partial<ShareMetadata>, files: ShareFile[] };
    if (!files?.length) return bad(c, 'No files provided');
    const id = metadata.id || crypto.randomUUID();
    const isWebsite = files.some(f => f.path.toLowerCase() === 'index.html');
    const shareData = {
      id,
      title: metadata.title || 'My Sketch',
      createdAt: Date.now(),
      fileCount: files.length,
      totalSize: files.reduce((acc, f) => acc + f.size, 0),
      isWebsite,
      mainFile: isWebsite ? 'index.html' : files[0].path,
      files: {} // Filled by entity
    };
    await ShareEntity.create(c.env, shareData);
    const entity = new ShareEntity(c.env, id);
    await entity.uploadFiles(files);
    return ok(c, { id });
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
  // Raw Content Serving (Crucial for hosting)
  app.get('/api/content/:id/:path{.+}', async (c) => {
    const id = c.req.param('id');
    const path = c.req.param('path');
    const entity = new ShareEntity(c.env, id);
    if (!await entity.exists()) return new Response('Not Found', { status: 404 });
    const file = await entity.getFile(path);
    if (!file) return new Response('File Not Found', { status: 404 });
    const binary = Uint8Array.from(atob(file.content), c => c.charCodeAt(0));
    return new Response(binary, {
      headers: {
        'Content-Type': file.type,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  });
  app.get('/api/shares', async (c) => {
    const page = await ShareEntity.list(c.env);
    return ok(c, page);
  });
}