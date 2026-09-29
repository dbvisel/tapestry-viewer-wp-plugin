<?php
/**
 * Plugin Name:       Tapestry Viewer Block
 * Description:       Embed an Internet Archive Tapestry export (.zip) in a post or page via a Gutenberg block, using the prebuilt @asteasolutions/tapestry-viewer static viewer.
 * Version:           0.1.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            Internet Archive
 * License:           MIT
 * Text Domain:       tapestry-viewer-block
 *
 * @package TapestryViewerBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'TAPESTRY_VIEWER_BLOCK_FILE', __FILE__ );
define( 'TAPESTRY_VIEWER_BLOCK_DIR', __DIR__ );
define( 'TAPESTRY_VIEWER_BLOCK_VERSION', '0.1.0' );

/**
 * Register the block once the vendored viewer assets are confirmed present.
 * A missing vendor/ directory means "npm run build" hasn't been run yet --
 * fail loudly with an admin notice rather than registering a block that can
 * never actually render anything.
 */
function tapestry_viewer_block_init() {
	$viewer_index = TAPESTRY_VIEWER_BLOCK_DIR . '/vendor/tapestry-viewer/dist/index.html';

	if ( ! file_exists( $viewer_index ) ) {
		add_action( 'admin_notices', 'tapestry_viewer_block_missing_vendor_notice' );
		return;
	}

	$build_dir = TAPESTRY_VIEWER_BLOCK_DIR . '/build';

	if ( ! file_exists( $build_dir . '/block.json' ) ) {
		add_action( 'admin_notices', 'tapestry_viewer_block_missing_build_notice' );
		return;
	}

	register_block_type( $build_dir );
}
add_action( 'init', 'tapestry_viewer_block_init' );

/**
 * Admin notice shown when the plugin's own npm build hasn't produced the
 * block editor assets yet.
 */
function tapestry_viewer_block_missing_build_notice() {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}
	?>
	<div class="notice notice-error">
		<p>
			<?php
			esc_html_e(
				'Tapestry Viewer Block: block assets are missing. Run "npm install && npm run build" in the plugin directory.',
				'tapestry-viewer-block'
			);
			?>
		</p>
	</div>
	<?php
}

/**
 * Admin notice shown when the vendored @asteasolutions/tapestry-viewer
 * package hasn't been copied into vendor/ yet.
 */
function tapestry_viewer_block_missing_vendor_notice() {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}
	?>
	<div class="notice notice-error">
		<p>
			<?php
			esc_html_e(
				'Tapestry Viewer Block: the vendored viewer assets are missing. Run "npm install && npm run build" in the plugin directory.',
				'tapestry-viewer-block'
			);
			?>
		</p>
	</div>
	<?php
}

/**
 * WordPress blocks .zip uploads by default (a generic security precaution,
 * not something specific to this plugin) -- without this, editors can't
 * attach a Tapestry export through the normal Media Library at all.
 */
function tapestry_viewer_block_allow_zip_uploads( $mimes ) {
	$mimes['zip'] = 'application/zip';
	return $mimes;
}
add_filter( 'upload_mimes', 'tapestry_viewer_block_allow_zip_uploads' );

/**
 * Some hosts additionally re-validate the uploaded file's real type via
 * wp_check_filetype_and_ext() independent of the upload_mimes allowlist
 * above, and can still reject a genuine .zip with "Sorry, this file type is
 * not permitted for security reasons" even after that filter runs. Back it
 * up by trusting the extension when the earlier checks came back empty.
 */
function tapestry_viewer_block_check_zip_filetype( $data, $file, $filename, $mimes ) {
	if ( empty( $data['ext'] ) && empty( $data['type'] ) && preg_match( '/\.zip$/i', $filename ) ) {
		$data['ext']  = 'zip';
		$data['type'] = 'application/zip';
	}
	return $data;
}
add_filter( 'wp_check_filetype_and_ext', 'tapestry_viewer_block_check_zip_filetype', 10, 4 );
