#!/usr/bin/env node
// Copies the prebuilt static viewer from the @asteasolutions/tapestry-viewer
// npm package into vendor/tapestry-viewer/dist, where the plugin serves it
// from directly (a normal, world-readable static file under the plugin's own
// directory -- no extra web-server config needed).
import { cpSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const root = path.resolve( __dirname, '..' );
const src = path.join(
	root,
	'node_modules',
	'@asteasolutions',
	'tapestry-viewer',
	'dist'
);
const destDir = path.join( root, 'vendor', 'tapestry-viewer' );
const dest = path.join( destDir, 'dist' );

if ( ! existsSync( src ) ) {
	console.error(
		`@asteasolutions/tapestry-viewer's dist/ was not found at ${ src } -- run "npm install" first.`
	);
	process.exit( 1 );
}

rmSync( destDir, { recursive: true, force: true } );
cpSync( src, dest, { recursive: true } );

console.log( `Copied Tapestry Viewer dist -> ${ path.relative( root, dest ) }` );
