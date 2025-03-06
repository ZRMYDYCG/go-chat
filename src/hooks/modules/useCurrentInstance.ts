/*
 * @description: 当前组件实例hooks，用以提供常用工具等
 */

import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue'
import { getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义 proxy 上的自定义属性类型
interface CustomProperties {
  $api: any
  $HTTP: any
  $HTTP_CODE: any
  $dict: any
  $is: any
  $dataHelpers: any
  $common: any
}

export const useCurrentInstance = () => {
  const router = useRouter()
  const route = useRoute()

  const currentInstance = getCurrentInstance()

  if (!currentInstance) {
    throw new Error('useCurrentInstance must be called within a setup function')
  }

  const { proxy } = currentInstance as ComponentInternalInstance & { proxy: ComponentPublicInstance & CustomProperties }

  const { $api, $HTTP, $HTTP_CODE, $dict, $is, $dataHelpers, $common } = proxy

  return {
    router,
    route,
    currentInstance,
    proxy,
    $api,
    $HTTP,
    $HTTP_CODE,
    $dict,
    $is,
    $dataHelpers,
    $common,
  }
}
