/**
 * @description: 页面列表
 * */

import { HTTP_CODE } from '@/settings/config/http'
import { isFunction } from '@/utils/helper/is'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'

interface PageListOptions<T> {
  getPageListApi: (params: any) => Promise<any>
  searchParams: Ref<{ [key: string]: any }>
  dataAppend?: 'start' | 'end'
}

interface PageListResult<T> {
  list: Ref<T[]>
  page: Ref<number>
  limit: Ref<number>
  count: Ref<number>
  loadding: Ref<boolean>
  getPageList: () => Promise<void>
  initData: () => void
  refreshing: Ref<boolean>
  refreshPageList: () => Promise<void>
  handleRefresh: () => Promise<void>
  loadMore: () => Promise<void>
  isNoMore: Ref<boolean>
  isEmpty: Ref<boolean>
}

export const usePageList = <T>(options: PageListOptions<T>): PageListResult<T> => {
  const { getPageListApi, searchParams, dataAppend = 'end' } = options

  const appendData = (rows: T[]) => {
    if (dataAppend === 'start') {
      list.value = [...rows, ...list.value]
    } else if (dataAppend === 'end') {
      list.value = [...list.value, ...rows]
    }
  }

  if (!isFunction(getPageListApi)) {
    throw new Error(`getPageListApi: ${getPageListApi}，需要为函数`)
  }

  const originData = {
    list: [] as T[],
    page: 1,
    limit: 10,
    count: 0,
  }

  const initData = () => {
    list.value = [...originData.list]
    page.value = originData.page
    limit.value = originData.limit
    count.value = originData.count
  }

  const list = ref<T[]>([...originData.list]) as Ref<T[]>
  const page = ref(originData.page) as Ref<number>
  const limit = ref(originData.limit) as Ref<number>
  const count = ref(originData.count) as Ref<number>
  const loadding = ref(false) as Ref<boolean>

  const getPageList = async () => {
    loadding.value = true
    const params = {
      ...searchParams.value,
      page: page.value,
      limit: limit.value,
    }

    const res = await getPageListApi({ params })
      .catch(() => {
        ElMessage({
          type: 'error',
          message: '获取待办列表失败',
          duration: 3000,
        })
      })
      .finally(() => {
        loadding.value = false
      })

    if (res && res.data) {
      const { code, data, message } = res.data
      const { count: total, rows } = data

      if (code === HTTP_CODE.HTTP_SUCCESS_CODE) {
        if (rows.length) {
          appendData(rows)
          page.value = page.value + 1
          count.value = total
        }
      } else {
        ElMessage({
          type: 'error',
          message,
          duration: 3000,
        })
      }
    }
  }

  const refreshing = ref(false) as Ref<boolean>
  const refreshPageList = async () => {
    initData()
    await getPageList()
  }

  const handleRefresh = async () => {
    refreshing.value = true
    await refreshPageList().finally(() => {
      refreshing.value = false
    })
  }

  const loadMore = async () => {
    if (isNoMore.value) {
      return
    }
    await getPageList()
  }

  const isNoMore = computed(() => {
    return list.value.length >= count.value && page.value > 1
  })

  const isEmpty = computed(() => {
    return list.value.length === 0 && page.value > 1
  })

  return {
    list,
    page,
    limit,
    count,
    loadding,
    getPageList,
    initData,
    refreshing,
    refreshPageList,
    handleRefresh,
    loadMore,
    isNoMore,
    isEmpty,
  }
}
