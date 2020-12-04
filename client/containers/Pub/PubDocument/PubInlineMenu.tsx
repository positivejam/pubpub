import React from 'react';
import uuidv4 from 'uuid/v4';
import { Button } from '@blueprintjs/core';

import { setLocalHighlight, moveToEndOfSelection } from 'components/Editor';
import Icon from 'components/Icon/Icon';
import ClickToCopyButton from 'components/ClickToCopyButton/ClickToCopyButton';
import { usePageContext } from 'utils/hooks';
import { pubUrl } from 'utils/canonicalUrls';

require('./pubInlineMenu.scss');

type OwnProps = {
	pubData: any;
	collabData: any;
	historyData: any;
	openLinkMenu?: (...args: any[]) => any;
};

const defaultProps = {
	openLinkMenu: () => {},
	// onNewHighlightDiscussion: () => {},
};

const shouldOpenBelowSelection = () => {
	return ['Android', 'iPad', 'iPhone'].some((device) =>
		navigator.userAgent.toLowerCase().includes(device.toLowerCase()),
	);
};

type Props = OwnProps & typeof defaultProps;

const PubInlineMenu = (props: Props) => {
	const { pubData, collabData, historyData } = props;
	const { communityData, scopeData } = usePageContext();
	const { canView, canCreateDiscussions } = scopeData.activePermissions;
	const selection = collabData.editorChangeObject.selection || {};
	const selectionBoundingBox = collabData.editorChangeObject.selectionBoundingBox || {};

	if (
		!collabData.editorChangeObject.selection ||
		selection.empty ||
		selection.$anchorCell ||
		collabData.editorChangeObject.selectedNode
	) {
		return null;
	}

	const topPosition =
		window.scrollY +
		(shouldOpenBelowSelection()
			? selectionBoundingBox.bottom + 10
			: selectionBoundingBox.top - 50);
	const menuStyle = {
		position: 'absolute',
		top: topPosition,
		left: selectionBoundingBox.left,
	};
	const menuItems = collabData.editorChangeObject.menuItems;
	const menuItemsObject = menuItems.reduce((prev, curr) => {
		return { ...prev, [curr.title]: curr };
	}, {});
	const formattingItems = [
		{ key: 'header1', icon: <Icon icon="header-one" /> },
		{ key: 'header2', icon: <Icon icon="header-two" /> },
		{ key: 'strong', icon: <Icon icon="bold" /> },
		{ key: 'em', icon: <Icon icon="italic" /> },
		{ key: 'link', icon: <Icon icon="link" /> },
	];
	return (
		// @ts-expect-error ts-migrate(2322) FIXME: Type '{ position: string; top: any; left: any; }' ... Remove this comment to see the full error message
		<div className="pub-inline-menu-component bp3-elevation-2" style={menuStyle}>
			{!pubData.isReadOnly &&
				formattingItems.map((item) => {
					if (!menuItemsObject[item.key]) {
						return null;
					}
					const onClickAction =
						item.key === 'link'
							? () => {
									menuItemsObject[item.key].run();
									props.openLinkMenu();
							  }
							: menuItemsObject[item.key].run;
					return (
						<Button
							key={item.key}
							minimal={true}
							icon={item.icon}
							active={menuItemsObject[item.key].isActive}
							onClick={onClickAction}
							onMouseDown={(evt) => {
								evt.preventDefault();
							}}
						/>
					);
				})}
			{(canView || canCreateDiscussions) && (
				<Button
					minimal={true}
					icon={<Icon icon="chat" />}
					onClick={() => {
						const view = collabData.editorChangeObject.view;
						setLocalHighlight(view, selection.from, selection.to, uuidv4());
						moveToEndOfSelection(collabData.editorChangeObject.view);
					}}
				/>
			)}
			<ClickToCopyButton
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
				className="click-to-copy"
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
				icon="clipboard"
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
				copyString={pubUrl(communityData, pubData, {
					isDraft: !pubData.isRelease,
					releaseNumber: pubData.releaseNumber,
					historyKey: historyData.currentKey,
					query: { from: selection.from, to: selection.to },
				})}
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
				beforeCopyPrompt="Copy a permalink"
			/>
		</div>
	);
};
PubInlineMenu.defaultProps = defaultProps;
export default PubInlineMenu;
