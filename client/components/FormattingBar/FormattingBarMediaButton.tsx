import React, { useState } from 'react';

import { Overlay } from 'components';
import { usePubData } from 'client/containers/Pub/pubHooks';
import { EditorChangeObject } from 'client/types';

import FormattingBarButton, { FormattingBarButtonProps } from './FormattingBarButton';
import Media from './media/Media';

type FormattingBarMediaButtonProps = FormattingBarButtonProps & {
	editorChangeObject: EditorChangeObject;
};

const FormattingBarMediaButton = React.forwardRef<unknown, FormattingBarMediaButtonProps>(
	(props, ref) => {
		const { editorChangeObject, isSmall, onClick, isIndicated, isOpen, ...restProps } = props;
		const pubData = usePubData();
		const [isModalOpen, setModalOpen] = useState(false);
		const handleInsert = (insertType, insertData) => {
			const { insertFunctions } = editorChangeObject;
			if (insertFunctions) {
				insertFunctions[insertType](insertData);
			}
			setModalOpen(false);
		};

		return (
			<>
				<Overlay isOpen={isModalOpen} onClose={() => setModalOpen(false)} maxWidth={750}>
					<Media
						editorChangeObject={editorChangeObject}
						onInsert={handleInsert}
						isSmall={Boolean(isSmall)}
					/>
				</Overlay>
				<div className="separator" />
				<FormattingBarButton
					{...restProps}
					ref={ref}
					isIndicated={isIndicated}
					isOpen={isOpen}
					isSmall={isSmall}
					label="Media"
					onClick={isIndicated || isOpen ? onClick : () => setModalOpen(true)}
				/>
			</>
		);
	},
);

export default FormattingBarMediaButton;
