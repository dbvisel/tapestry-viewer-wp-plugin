=== Tapestry Viewer Block ===
Contributors: internetarchive
Tags: block, embed, tapestry, internet archive
Requires at least: 6.5
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 0.1.0
License: MIT
License URI: https://opensource.org/licenses/MIT

Embed an Internet Archive Tapestry export (.zip) in a post or page via a Gutenberg block.

== Description ==

This plugin adds a "Tapestry Viewer" block. Pick a Tapestry export `.zip` from the
Media Library and the block embeds it read-only, using the prebuilt, static
`@asteasolutions/tapestry-viewer` npm package -- no server-side rendering pipeline,
no database of Tapestry content, just the viewer's own client-side zip reader.

The viewer is vendored into this plugin at build time (see "Building" below); the
plugin does not depend on Node.js, npm, or the tapestry-project monorepo at runtime.

== Installation ==

1. Upload the plugin (see "Building" below for how to produce the zip, or use a
   checkout with `vendor/` and `build/` already built).
2. Activate it under Plugins.
3. Edit a post or page, add the "Tapestry Viewer" block, and select a `.zip` from
   the Media Library.

If Tapestry `.zip` uploads are rejected with a file-type error, check that the
`upload_mimes` filter this plugin adds hasn't been overridden by another plugin or
a hosting-level upload restriction.

== Building ==

This repository ships only the source (`src/`); the block's compiled editor
assets (`build/`) and the vendored viewer (`vendor/`) are build output, not
committed to version control.

    npm install
    npm run build       # compiles the block (wp-scripts) and vendors the viewer
    npm run plugin-zip  # produces dist/tapestry-viewer-block.zip for upload

== Changelog ==

= 0.1.0 =
* Initial release. Vendors @asteasolutions/tapestry-viewer 0.1.1.
