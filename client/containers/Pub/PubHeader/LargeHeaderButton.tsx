import React from 'react';
import classNames from 'classnames';
import { Button } from 'reakit';

import { Icon } from 'components';

require('./largeHeaderButton.scss');

type Props = {
	active?: boolean;
	className?: string;
	disabled?: boolean;
	icon?: React.ReactNode | string;
	label?:
		| {
				top?: React.ReactNode;
				bottom?: React.ReactNode;
		  }
		| React.ReactNode;
	onClick?: (...args: any[]) => any;
	outerLabel?:
		| {
				top?: React.ReactNode;
				bottom?: React.ReactNode;
		  }
		| React.ReactNode;
	showCaret?: boolean;
	tagName?: string;
};

const defaultProps = {
	active: false,
	className: '',
	disabled: false,
	icon: null,
	label: undefined,
	onClick: null,
	outerLabel: undefined,
	showCaret: false,
	tagName: 'button',
};

const LargeHeaderButton = React.forwardRef<any, Props>((props, ref) => {
	const {
		active,
		className,
		disabled,
		icon,
		label,
		onClick,
		outerLabel,
		showCaret,
		tagName,
		...restProps
	} = props;
	// @ts-expect-error ts-migrate(2339) FIXME: Property 'top' does not exist on type 'string | nu... Remove this comment to see the full error message
	const hasStackedLabel = label && label.top && label.bottom;
	// @ts-expect-error ts-migrate(2339) FIXME: Property 'top' does not exist on type 'string | nu... Remove this comment to see the full error message
	const hasStackedOuterLabel = outerLabel && outerLabel.top && outerLabel.bottom;
	return (
		<Button
			disabled={disabled}
			// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
			as={tagName}
			className={classNames(
				'large-header-button-component',
				'pub-header-themed-box-hover-target',
				className,
			)}
			onClick={onClick}
			ref={ref}
			{...restProps}
		>
			<div
				className={classNames(
					'button-box',
					'pub-header-themed-box',
					!label && 'no-label',
					active && 'active',
				)}
			>
				{typeof icon === 'string' ? <Icon icon={icon} iconSize={22} /> : icon}
				{showCaret && <Icon icon="caret-down" className="caret" iconSize={10} />}
				{label && !hasStackedLabel && <div className="label">{label}</div>}
				{hasStackedLabel && (
					<div className="stacked-label">
						{/* @ts-expect-error ts-migrate(2533) FIXME: Object is possibly 'null' or 'undefined'. */}
						<div className="top">{label.top}</div>
						{/* @ts-expect-error ts-migrate(2533) FIXME: Object is possibly 'null' or 'undefined'. */}
						<div className="bottom pub-header-themed-secondary">{label.bottom}</div>
					</div>
				)}
			</div>
			{outerLabel && !hasStackedOuterLabel && <div className="outer-label">{outerLabel}</div>}
			{hasStackedOuterLabel && (
				<div className="outer-label">
					{/* @ts-expect-error ts-migrate(2533) FIXME: Object is possibly 'null' or 'undefined'. */}
					<div className="top pub-header-themed-secondary">{outerLabel.top}</div>
					{/* @ts-expect-error ts-migrate(2533) FIXME: Object is possibly 'null' or 'undefined'. */}
					<div className="bottom">{outerLabel.bottom}</div>
				</div>
			)}
		</Button>
	);
});
// @ts-expect-error ts-migrate(2322) FIXME: Type '{ active: boolean; className: string; disabl... Remove this comment to see the full error message
LargeHeaderButton.defaultProps = defaultProps;
export default LargeHeaderButton;
