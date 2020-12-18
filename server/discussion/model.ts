export default (sequelize, dataTypes) => {
	return sequelize.define(
		'DiscussionNew',
		{
			id: sequelize.idType,
			title: { type: dataTypes.TEXT },
			number: { type: dataTypes.INTEGER, allowNull: false },
			isClosed: { type: dataTypes.BOOLEAN },
			labels: { type: dataTypes.JSONB },
			/* Set by Associations */
			threadId: { type: dataTypes.UUID, allowNull: false },
			visibilityId: { type: dataTypes.UUID, allowNull: false },
			userId: { type: dataTypes.UUID, allowNull: false },
			anchorId: { type: dataTypes.UUID },
			pubId: { type: dataTypes.UUID },
		},
		{
			indexes: [
				{ fields: ['userId'], method: 'BTREE' },
				{ fields: ['pubId'], method: 'BTREE' },
			],
			classMethods: {
				associate: (models) => {
					const {
						Discussion,
						DiscussionAnchor,
						Visibility,
						Pub,
						User,
						Anchor,
						Thread,
					} = models;
					Discussion.belongsTo(Thread, {
						onDelete: 'CASCADE',
						as: 'thread',
						foreignKey: 'threadId',
					});
					Discussion.belongsTo(Visibility, {
						onDelete: 'CASCADE',
						as: 'visibility',
						foreignKey: 'visibilityId',
					});
					Discussion.belongsTo(User, {
						onDelete: 'CASCADE',
						as: 'author',
						foreignKey: 'userId',
					});
					Discussion.belongsTo(Anchor, {
						onDelete: 'CASCADE',
						as: 'anchor',
						foreignKey: 'anchorId',
					});
					Discussion.belongsTo(Pub, {
						onDelete: 'CASCADE',
						as: 'pub',
						foreignKey: 'pubId',
					});
					Discussion.hasMany(DiscussionAnchor, {
						onDelete: 'CASCADE',
						as: 'anchors',
						foreignKey: 'discussionId',
					});
				},
			},
		},
	);
};
