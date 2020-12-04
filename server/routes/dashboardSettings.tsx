import React from 'react';

import Html from 'server/Html';
import app from 'server/server';
import { handleErrors, ForbiddenError } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';
import { getPub, sanitizePub } from 'server/utils/queryHelpers';

const getSettingsData = async (pubSlug, initialData) => {
	if (pubSlug) {
		const pubData = await getPub(pubSlug, initialData.communityData.id, { getEdges: 'all' });
		// @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
		return { pubData: sanitizePub(pubData, initialData) };
	}
	return {};
};

app.get(
	['/dash/settings', '/dash/collection/:collectionSlug/settings', '/dash/pub/:pubSlug/settings'],
	async (req, res, next) => {
		try {
			if (!hostIsValid(req, 'community')) {
				return next();
			}
			const initialData = await getInitialData(req, true);
			const settingsData = await getSettingsData(req.params.pubSlug, initialData);

			if (!initialData.scopeData.activePermissions.canView) {
				// @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
				throw new ForbiddenError();
			}

			return renderToNodeStream(
				res,
				<Html
					chunkName="DashboardSettings"
					initialData={initialData}
					viewData={{ settingsData: settingsData }}
					// @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ initialData: { communityData: ... Remove this comment to see the full error message
					headerComponents={generateMetaComponents({
						initialData: initialData,
						// @ts-expect-error ts-migrate(2339) FIXME: Property 'elements' does not exist on type '{ elem... Remove this comment to see the full error message
						title: `Settings · ${initialData.scopeData.elements.activeTarget.title}`,
						unlisted: true,
					})}
				/>,
			);
		} catch (err) {
			return handleErrors(req, res, next)(err);
		}
	},
);
