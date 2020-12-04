import { CollectionPub } from 'server/models';
import { getScope } from 'server/utils/queryHelpers';

const canManagePub = async ({ userId, communityId, pubId }) => {
	const scopeData = await getScope({ loginId: userId, communityId: communityId, pubId: pubId });
	return (
		scopeData.activePermissions.canManage &&
		scopeData.elements.activePub.communityId === communityId
	);
};

export const canCreateCollectionPub = async ({ userId, communityId, collectionId, pubId }) => {
	const {
		activePermissions: { canManage },
		elements: {
			activeCollection: { isRestricted },
		},
	} = await getScope({
		communityId: communityId,
		collectionId: collectionId,
		loginId: userId,
	});
	if (canManage) {
		return true;
	}
	if (!isRestricted) {
		return canManagePub({ userId: userId, communityId: communityId, pubId: pubId });
	}
	return false;
};

export const getUpdatableFieldsForCollectionPub = async ({
	userId,
	communityId,
	collectionPubId,
}) => {
	const { pubId, collectionId } = await CollectionPub.findOne({ where: { id: collectionPubId } });
	const {
		elements: { activeCollection },
		activePermissions,
	} = await getScope({
		communityId: communityId,
		collectionId: collectionId,
		loginId: userId,
	});
	if (activePermissions.canManage) {
		return ['rank', 'pubRank', 'contextHint'];
	}
	const canUpdatePubRank = await canManagePub({
		userId: userId,
		communityId: activeCollection.communityId,
		pubId: pubId,
	});
	if (canUpdatePubRank) {
		return ['pubRank'];
	}
	return null;
};

export const canDestroyCollectionPub = async ({ userId, communityId, collectionPubId }) => {
	const { collectionId, pubId } = await CollectionPub.findOne({ where: { id: collectionPubId } });
	const {
		activePermissions: { canManage },
		elements: {
			activeCollection: { isRestricted },
		},
	} = await getScope({
		communityId: communityId,
		collectionId: collectionId,
		loginId: userId,
	});
	if (canManage) {
		return true;
	}
	if (!isRestricted) {
		return canManagePub({ userId: userId, communityId: communityId, pubId: pubId });
	}
	return false;
};
