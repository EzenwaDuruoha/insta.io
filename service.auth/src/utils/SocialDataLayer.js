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
}
module.exports = SocialDataLayer
