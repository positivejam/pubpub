import React from 'react';
import { storiesOf } from '@storybook/react';

import Pricing from 'containers/Pricing/Pricing';
import { locationData, loginData, communityData } from 'utils/storybook/data';

storiesOf('containers/Pricing', module).add('default', () => (
	// @ts-expect-error ts-migrate(2322) FIXME: Type '{ locationData: { hostname: string; path: st... Remove this comment to see the full error message
	<Pricing locationData={locationData} loginData={loginData} communityData={communityData} />
));
