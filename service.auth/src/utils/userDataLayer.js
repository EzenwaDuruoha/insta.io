class UserDataLayer {
  /**
     *
     * @param {DatabaseService} dbService
     */
  constructor (dbService) {
    this.dbService = dbService
  }

  /**
     *
     * @param {String} username
     * @param {String} email
     * @param {String} password
     * @returns {Promise<User>}
     */
  async createUser (username, email, password) {
    const {data: userRepo} = await this.dbService.getRepoByName('UserEntity')
    const User = this.dbService.getModel('User')
    const user = User.create({username, email})
    await user.hashPassword(password)
    return userRepo.save(user)
  }

  /**
   *
   * @param {User} user
   * @param {Object} data
   */
  async createUserProfile (user, data = {}) {
    const {data: profileRepo} = await this.dbService.getRepoByName('UserProfileEntity')
    const UserProfile = this.dbService.getModel('UserProfile')
    const profile = UserProfile.create({user, ...data})
    return profileRepo.save(profile)
  }

  /**
   *
   * @param {User} user
   * @param {Object} data
   */
  async createUserSettings (user, data = {}) {
    const {data: settingsRepo} = await this.dbService.getRepoByName('UserSettingsEntity')
    const UserSettings = this.dbService.getModel('UserSettings')
    const userSettings = UserSettings.create({user, ...data})
    return settingsRepo.save(userSettings)
  }

  /**
   *
   * @param {Object} args
   * @param {Object} meta
   */
  async getUser (args = {}, meta = {}) {
    const {data: userRepo} = await this.dbService.getRepoByName('UserEntity')
    return userRepo.findOne({
      where: [
        args
      ],
      ...meta
    })
  }

  /**
     *
     * @param {String} username
     * @param {String} email
     */
  async userExits (username, email) {
    const {data: userRepo} = await this.dbService.getRepoByName('UserEntity')
    return userRepo.findOne({
      where: [
        {username},
        {email}
      ]
    })
  }
}

module.exports = UserDataLayer
