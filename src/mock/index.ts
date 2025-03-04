import Mock from 'mockjs'

const startMock = () => {
  Mock.setup({
    timeout: '300-500',
  })
  const modules = import.meta.glob('./modules/*.ts', { eager: true })
  Object.entries(modules).forEach(([, module]) => {
    ;(module as { default: () => void }).default()
  })
}

const initMock = (development: boolean): void => {
  if (development === false) {
    return
  }

  startMock()
}

export default initMock
