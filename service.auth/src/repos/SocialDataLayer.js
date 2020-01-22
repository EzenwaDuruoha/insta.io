class SocialDataLayer {
  /**
     *
     * @param {DatabaseService} dbService
     */
  constructor (dbService) {
    this.dbService = dbService
  }

  followUpdateOrCreate (follower, followed, state = false) {
    return this.dbService.query()
      .insert()
      .into('Follow')
      .values({followed, follower, unfollowed: state})
      .onConflict('("followerId", "followedId") DO UPDATE SET "unfollowed" = :unfollowed')
      .setParameter('unfollowed', state)
      .execute()
  }

  async getFollows (id, stat = 'following', fields = []) {
    const tablename = 'follows'
    const defaultFields = [
      'follows."unfollowed" as unfollowed',
      "json_build_object('id', followed.id, 'username', followed.username) as followed",
      "json_build_object('id', follower.id, 'username', follower.username) as follower"
    ]
    const conditions = {
      following: `${tablename}."followerId"= :id and ${tablename}."unfollowed" = FALSE`,
      followers: `${tablename}."followedId"= :id and ${tablename}."unfollowed" = FALSE`
    }
    if (!fields.length) {
      fields = defaultFields
    }

    const {data: followRepo} = await this.dbService.getRepoByName('FollowEntity')
    return followRepo.createQueryBuilder(tablename)
      .select(fields)
      .leftJoin('User', 'follower', 'follows."followerId" = follower.id')
      .leftJoin('User', 'followed', 'follows."followedId" = followed.id')
      .where(conditions[stat], {id})
      .getRawMany()
      // .getSql()
      // .getMany()
  }
}
module.exports = SocialDataLayer
