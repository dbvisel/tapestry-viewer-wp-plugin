#!/usr/bin/env node
// Zips up exactly what a WordPress install needs -- not the whole repo (no
// node_modules/, src/, or dev config) -- into dist/tapestry-viewer-block.zip,
// ready to upload via Plugins > Add New > Upload Plugin.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const root = path.resolve( __dirname, '..' );
const slug = 'tapestry-viewer-block';
const stageRoot = path.join( root, '.plugin-zip-stage' );
const stage = path.join( stageRoot, slug );
const outDir = path.join( root, 'dist' );
const outFile = path.join( outDir, `${ slug }.zip` );

const INCLUDE = [
	'tapestry-viewer-block.php',
	'build',
	'vendor',
	'readme.txt',
	'LICENSE',
];

for ( const name of INCLUDE ) {
	const p = path.join( root, name );
	if ( ! existsSync( p ) ) {
		console.error(
			`Missing "${ name }" -- run "npm run build" before "npm run plugin-zip".`
		);
		process.exit( 1 );
	}
}

rmSync( stageRoot, { recursive: true, force: true } );
mkdirSync( stage, { recursive: true } );
for ( const name of INCLUDE ) {
	cpSync( path.join( root, name ), path.join( stage, name ), {
		recursive: true,
	} );
}

mkdirSync( outDir, { recursive: true } );
rmSync( outFile, { force: true } );
execFileSync( 'zip', [ '-r', '-q', outFile, slug ], { cwd: stageRoot } );
rmSync( stageRoot, { recursive: true, force: true } );

console.log( `Wrote ${ path.relative( root, outFile ) }` );
