import React from 'react';
import { storiesOf } from '@storybook/react';

import { Pub } from 'containers';
import { pubData, loginData, communityData, locationData } from 'utils/storybook/data';

storiesOf('containers/Pub', module).add('default', () => (
	<Pub
		// @ts-expect-error ts-migrate(2322) FIXME: Type '{ communityData: { id: string; subdomain: st... Remove this comment to see the full error message
		communityData={communityData}
		loginData={loginData}
		locationData={locationData}
		pubData={{
			...pubData,
			mode: 'document',
		}}
	/>
));
