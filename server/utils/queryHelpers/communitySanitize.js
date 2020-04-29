export default (communityData, locationData, scopeData) => {
	const cleanedData = { ...communityData };
	const { canManageCommunity } = scopeData.activePermissions;
	const availablePages = {};
	cleanedData.pages = cleanedData.pages.filter((item) => {
		if (!canManageCommunity && !item.isPublic && locationData.query.access !== item.viewHash) {
			return false;
		}

		availablePages[item.id] = {
			id: item.id,
			title: item.title,
			slug: item.slug,
		};
		return true;
	});

	cleanedData.collections = cleanedData.collections
		.filter((item) => {
			return canManageCommunity || item.isPublic;
		})
		.map((collection) => {
			if (!collection.pageId) {
				return collection;
			}
			return {
				...collection,
				page: availablePages[collection.pageId],
			};
		});
	return cleanedData;
};
