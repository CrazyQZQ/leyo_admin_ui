import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/user'
import store from '@/store'

export interface IUserState {
  id: number
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string
}

@Module({ dynamic: true, store, name: 'user', preserveState: localStorage.getItem('vuex') !== null })
class User extends VuexModule implements IUserState {
  public id= -1
  public token = ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''

  @Mutation
  private SET_ID(id: number) {
    this.id = id
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Action
  public async Login(userInfo: { username: string, password: string }) {
    let { username, password } = userInfo
    username = username.trim()
    const { data } = await login({ username, password })
    this.SET_TOKEN(data.token.access_token)
    const { userId, authorities, userName, avatar, remark, email } = data.user
    this.SET_ID(userId)
    this.SET_ROLES(authorities)
    this.SET_NAME(userName)
    this.SET_AVATAR(avatar)
    this.SET_INTRODUCTION(remark)
    this.SET_EMAIL(email)
  }

  @Action
  public ResetToken() {
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getUserInfo({ id: this.id })
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const { authorities, userName, avatar, remark, email } = data
    // roles must be a non-empty array
    // if (!roles || roles.length <= 0) {
    //   throw Error('GetUserInfo: roles must be a non-null array!')
    // }
    this.SET_ROLES(authorities)
    this.SET_NAME(userName)
    this.SET_AVATAR(avatar)
    this.SET_INTRODUCTION(remark)
    this.SET_EMAIL(email)
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
