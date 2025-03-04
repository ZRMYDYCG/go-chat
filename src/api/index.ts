const api = {}
const apiFiles = import.meta.glob('./modules/*.js', { eager: true })

Object.entries(apiFiles).forEach(([path, module]) => {
  const fileName = (path.match(/\/(\w+)\./) as RegExpMatchArray)[1]
  api[fileName] = module
})

export default api
