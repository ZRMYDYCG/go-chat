import type { App } from 'vue'

interface VueComponent {
  name?: string
}

interface Module {
  default: VueComponent
}

const componentPlugin = {
  install(app: App) {
    const modules = import.meta.glob('@/components/**/*.vue', {
      eager: true,
    }) as Record<string, Module>

    Object.entries(modules).forEach(([, module]) => {
      if (module.default.name) {
        app.component(module.default.name, module.default)
      }
    })
  },
}

export default componentPlugin
