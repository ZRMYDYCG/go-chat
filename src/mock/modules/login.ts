import { mock } from 'mockjs'

const loginMock = () => {
  mock(/\/api\/v1\/user\/regist/, 'post', (options) => {
    const params = JSON.parse(options.body)
    // console.log('/api/v1/register接口请求参数', params)

    if (!params) return

    return {
      code: 200,
      data: null,
      message: '注册成功',
    }
  })

  mock(/\/api\/v1\/user\/login/, 'post', (options) => {
    const params = JSON.parse(options.body)
    // console.log('/api/v1/login接口请求参数', params)

    if (!params) return

    // 32位随机token生成
    function returnToken() {
      const abc = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('')
      let token = ''
      for (let i = 0; i < 32; i += 1) {
        token += abc[Math.floor(Math.random() * abc.length)]
      }
      return token
    }

    // 用户信息
    const userInfo = {
      info: {
        account: 'todo_6666',
        avatar: 'http://localhost:3000/upload/avater/1c7d29ca73ae4d6cfc4fd5c14.jpg',
        birthday: '2005-01-01',
        id: 1,
        sex: '1',
      },
      token: returnToken(),
    }

    return {
      code: 200,
      data: userInfo,
      message: '登录成功',
    }
  })
}

export default loginMock
