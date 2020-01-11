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
   * @param {String} entity
   * @param {Object} args
   * @param {Object} meta
   */
  async getResources (entity, args = [], meta = {}) {
    const {data: repo} = await this.dbService.getRepoByName(entity)
    return repo.findOne({
      where: args,
      ...meta
    })
  }

  /**
   *
   * @param {Object} args
   * @param {Object} meta
   */
  async getUser (args = [], meta = {}) {
    return this.getResources('UserEntity', args, meta)
  }

  /**
   *
   * @param {Object} args
   * @param {Object} meta
   */
  async getProfile (args = [], meta = {}) {
    return this.getResources('UserProfileEntity', args, meta)
  }

  /**
     *
     * @param {String} username
     * @param {String} email
     */
  async userExits ({username, email}) {
    const {data: userRepo} = await this.dbService.getRepoByName('UserEntity')
    return userRepo.findOne({
      where: [
        {username},
        {email}
      ]
    })
  }

  /**
   *
   * @param {String} entity
   * @param {uuid} id
   * @param {Model} model
   */
  async updateResource (entity, id, model) {
    const {data: repo} = await this.dbService.getRepoByName(entity)
    return repo.update(id, model)
  }

  /**
   *
   * @param {uuid} id
   * @param {UserModel} user
   */
  async updateUser (id, user) {
    return this.updateResource('UserEntity', id, user)
  }

  /**
   *
   * @param {uuid} id
   * @param {UserProfileModel} profile
   */
  async updateProfile (id, profile) {
    return this.updateResource('UserProfileEntity', id, profile)
  }

  /**
   *
   * @param {uuid} id
   * @param {UserSettingsModel} settings
   */
  async updateSettings (id, settings) {
    return this.updateResource('UserSettingsEntity', id, settings)
  }
}

module.exports = UserDataLayer
