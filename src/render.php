<?php
/**
 * Server-side render for the Tapestry Viewer block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content (unused; this block has no InnerBlocks).
 * @var WP_Block $block      Block instance (unused).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( empty( $attributes['mediaUrl'] ) ) {
	return;
}

$viewer_index_path = TAPESTRY_VIEWER_BLOCK_DIR . '/vendor/tapestry-viewer/dist/index.html';

if ( ! file_exists( $viewer_index_path ) ) {
	if ( current_user_can( 'edit_posts' ) ) {
		echo '<p>' . esc_html__( 'Tapestry Viewer: the vendored viewer assets are missing on this server. Run "npm install && npm run build" in the plugin directory.', 'tapestry-viewer-block' ) . '</p>';
	}
	return;
}

// Trailing "/index.html" is required, not just the directory -- the viewer's
// asset URLs are relative to the *file* the browser actually loaded, and
// some servers don't serve index.html for a bare directory URL at all.
$viewer_index_url = plugins_url( 'vendor/tapestry-viewer/dist/index.html', TAPESTRY_VIEWER_BLOCK_FILE );
$src               = add_query_arg( 'source', rawurlencode( $attributes['mediaUrl'] ), $viewer_index_url );
$height            = ! empty( $attributes['height'] ) ? absint( $attributes['height'] ) : 600;

$title = ! empty( $attributes['mediaFilename'] )
	? sprintf(
		/* translators: %s: file name of the embedded Tapestry export */
		__( 'Tapestry Viewer — %s', 'tapestry-viewer-block' ),
		$attributes['mediaFilename']
	)
	: __( 'Tapestry Viewer', 'tapestry-viewer-block' );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'style' => sprintf( 'display:block;height:%dpx;', $height ),
	)
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes internally. ?>>
	<iframe
		src="<?php echo esc_url( $src ); ?>"
		style="width:100%;height:100%;border:0;display:block;"
		loading="lazy"
		title="<?php echo esc_attr( $title ); ?>"
	></iframe>
</div>
