import React, { useContext } from 'react';
import classNames from 'classnames';
import { Classes } from '@blueprintjs/core';
import * as RK from 'reakit/Menu';

import { Placement } from 'popper.js';
import { MenuContext, MenuConfigContext } from './menuContexts';

export type MenuProps = {
	'aria-label'?: string;
	children: React.ReactNode;
	className?: string;
	disclosure: ((disclosureProps: RK.MenuDisclosureProps) => React.ReactNode) | React.ReactNode;
	gutter?: number;
	menuStyle?: object;
	onDismiss?: () => unknown;
	placement?: Placement;
};

const defaultProps = {
	className: '',
	gutter: undefined,
	menuStyle: {},
	onDismiss: () => {},
	placement: undefined,
};

const renderDisclosure = (disclosure, disclosureProps) => {
	if (typeof disclosure === 'function') {
		return disclosure(disclosureProps);
	}
	return React.cloneElement(disclosure, disclosureProps);
};

export const Menu = React.forwardRef((props: MenuProps, ref) => {
	const {
		'aria-label': ariaLabel,
		children,
		className,
		disclosure,
		placement,
		onDismiss,
		gutter,
		menuStyle,
		...restProps
	} = props;

	const menuConfig = useContext(MenuConfigContext);

	const menu = RK.useMenuState({
		placement: placement,
		gutter: gutter,
		unstable_preventOverflow: false,
		unstable_flip: false,
	});

	const handleDismiss = () => {
		menu.hide();
		onDismiss && onDismiss();
	};

	return (
		<React.Fragment>
			{/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
			<RK.MenuDisclosure
				ref={ref}
				style={{ display: 'inline-flex', WebkitAppearance: 'unset' }}
				{...menu}
				{...restProps}
			>
				{(disclosureProps) =>
					renderDisclosure(disclosure, { ...disclosureProps, 'aria-label': ariaLabel })
				}
			</RK.MenuDisclosure>
			<RK.Menu
				aria-label={ariaLabel}
				as="ul"
				style={{ zIndex: 20, ...menuStyle }}
				className={classNames(Classes.MENU, Classes.ELEVATION_1, className)}
				unstable_portal={menuConfig.usePortal}
				{...menu}
			>
				{/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ parentMenu: RK.MenuStateReturn; dismissMen... Remove this comment to see the full error message */}
				<MenuContext.Provider value={{ parentMenu: menu, dismissMenu: handleDismiss }}>
					{children}
				</MenuContext.Provider>
			</RK.Menu>
		</React.Fragment>
	);
});

Menu.defaultProps = defaultProps;
