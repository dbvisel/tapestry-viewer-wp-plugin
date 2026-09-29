import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	Placeholder,
	Button,
	PanelBody,
	RangeControl,
	Notice,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { useState } from '@wordpress/element';
import metadata from './block.json';

// The Media Library's type filter groups zips under a handful of different
// mime strings depending on how the browser/OS reported it on upload -- match
// all of them rather than assuming one canonical value.
const ALLOWED_MEDIA_TYPES = [
	'application/zip',
	'application/x-zip-compressed',
	'application/zip-compressed',
	'application/octet-stream',
];

function looksLikeZip( media ) {
	if ( ALLOWED_MEDIA_TYPES.includes( media.mime ) ) {
		return true;
	}
	return /\.zip$/i.test( media.filename || media.url || '' );
}

export default function Edit( { attributes, setAttributes } ) {
	const { mediaUrl, mediaFilename, height } = attributes;
	const blockProps = useBlockProps();
	const [ showFileTypeWarning, setShowFileTypeWarning ] = useState( false );

	function onSelectMedia( media ) {
		setShowFileTypeWarning( ! looksLikeZip( media ) );
		setAttributes( {
			mediaId: media.id,
			mediaUrl: media.url,
			mediaFilename: media.filename || '',
		} );
	}

	if ( ! mediaUrl ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon="media-archive"
					label={ __( 'Tapestry Viewer', 'tapestry-viewer-block' ) }
					instructions={ __(
						'Select a Tapestry export (.zip) from the Media Library to embed it here.',
						'tapestry-viewer-block'
					) }
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMedia }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							render={ ( { open } ) => (
								<Button variant="primary" onClick={ open }>
									{ __(
										'Select Tapestry ZIP',
										'tapestry-viewer-block'
									) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				</Placeholder>
			</div>
		);
	}

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Tapestry Viewer settings',
						'tapestry-viewer-block'
					) }
				>
					<RangeControl
						__nextHasNoMarginBottom
						label={ __( 'Height (px)', 'tapestry-viewer-block' ) }
						min={ 300 }
						max={ 1600 }
						value={ height }
						onChange={ ( value ) =>
							setAttributes( { height: value } )
						}
					/>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMedia }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							render={ ( { open } ) => (
								<Button variant="secondary" onClick={ open }>
									{ __(
										'Replace ZIP',
										'tapestry-viewer-block'
									) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>
			{ showFileTypeWarning && (
				<Notice status="warning" isDismissible={ false }>
					{ __(
						"The selected file doesn't look like a .zip export — the viewer may not load it correctly.",
						'tapestry-viewer-block'
					) }
				</Notice>
			) }
			<p className="tapestry-viewer-block__filename">
				{ mediaFilename
					? sprintf(
							/* translators: %s: file name of the embedded Tapestry export */
							__( 'Embedding: %s', 'tapestry-viewer-block' ),
							mediaFilename
					  )
					: null }
			</p>
			<ServerSideRender
				block={ metadata.name }
				attributes={ attributes }
			/>
		</div>
	);
}
