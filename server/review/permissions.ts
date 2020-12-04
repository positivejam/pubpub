import { getScope } from 'server/utils/queryHelpers';

export const getPermissions = async ({ userId, communityId, pubId }) => {
	if (!userId || !communityId || !pubId) {
		return {};
	}
	const scopeData = await getScope({
		communityId: communityId,
		pubId: pubId,
		loginId: userId,
	});

	if (!scopeData.elements.activePub) {
		return {};
	}

	const { canAdmin, canCreateReviews, canManage } = scopeData.activePermissions;

	let editProps = [];
	if (canManage) {
		// @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
		editProps = ['title', 'status', 'labels', 'releaseRequested'];
	}

	return {
		create: canCreateReviews,
		createRelease: canAdmin,
		update: editProps,
		destroy: canManage,
	};
};
