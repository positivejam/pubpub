import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor, { getJSON } from '@pubpub/editor';
import InputField from 'components/InputField/InputField';
import { Button } from '@blueprintjs/core';
import { getResizedUrl } from 'utilities';

const propTypes = {
	onChange: PropTypes.func.isRequired,
	layoutIndex: PropTypes.number.isRequired,
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* deprecated: title, align, width, text */
	/* align, text */
};

class LayoutEditorText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: `text-block-${props.layoutIndex}`,
			initialContent: this.props.content.text || undefined,
		};
		this.setAlignLeft = this.setAlignLeft.bind(this);
		this.setAlignCenter = this.setAlignCenter.bind(this);
		this.setText = this.setText.bind(this);
		this.textChangesMade = false;
	}

	setAlignLeft() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			align: 'left'
		});
	}

	setAlignCenter() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			align: 'center'
		});
	}

	setText(textJSON) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			text: textJSON,
		});
	}

	render() {
		const wrapperStyle = {
			textAlign: this.props.content.align || 'left',
		};
		return (
			<div className="layout-editor-text-component">
				<div className="block-header">
					<InputField label="Text Align">
						<div className="pt-button-group">
							<Button
								className={`${this.props.content.align === 'left' ? 'pt-active' : ''}`}
								onClick={this.setAlignLeft}
								text="Left"
							/>
							<Button
								className={`${this.props.content.align === 'center' ? 'pt-active' : ''}`}
								onClick={this.setAlignCenter}
								text="Center"
							/>
						</div>
					</InputField>
				</div>

				<div className="block-content">
					<div className="container">
						<div className="row">
							<div className="col-12">
								<div style={wrapperStyle} id={String(this.state.key)}>
									<Editor
										nodeOptions={{
											image: {
												onResizeUrl: (url)=> { return getResizedUrl(url, 'fit-in', '1200x0'); },
											},
										}}
										placeholder="Enter text..."
										initialContent={this.state.initialContent}
										onChange={(editorChangeObject)=> {
											if (editorChangeObject.view.state.history$.prevTime) {
												/* history$.prevTime will be 0 if the transaction */
												/* does not generate an undo item in the history */
												this.textChangesMade = true;
											}
											if (this.textChangesMade) {
												this.setText(getJSON(editorChangeObject.view));
											}
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

LayoutEditorText.propTypes = propTypes;
export default LayoutEditorText;
