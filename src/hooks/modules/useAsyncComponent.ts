import { isFunction } from '@/utils/helper/is'
import type { DefineComponent } from 'vue'
import { defineAsyncComponent } from 'vue'

interface AsyncComponentOptions {
  component: () => Promise<DefineComponent>
  wait?: () => Promise<void>
  timeout?: number
}

export const useAsyncComponent = (options: AsyncComponentOptions): { AsyncComponent: DefineComponent } => {
  const { component, wait, timeout } = options

  const loadDelay = async (wait: () => Promise<void>) => {
    if (!isFunction(wait)) {
      throw new Error(`wait: ${wait}需要为函数`)
    }
    await wait()
  }

  const AsyncComponent = defineAsyncComponent({
    // 加载函数
    loader: async () => {
      if (wait) {
        await loadDelay(wait)
      }
      return component()
    },
    timeout,
  })

  return {
    AsyncComponent,
  }
}
