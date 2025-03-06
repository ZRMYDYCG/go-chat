/**
 * @description: 页面列表
 * */
import { HTTP_CODE } from '@/settings/config/http'
import { isFunction } from '@/utils/helper/is'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'

// 定义接口和类型
interface PageListOptions<T> {
  getPageListApi: (params: any) => Promise<any>
  searchParams: Ref<any>
  dataAppend?: 'start' | 'end'
}

interface OriginData<T> {
  list: T[]
  page: number
  limit: number
  count: number
}

// 使用泛型 T 来表示列表项的类型
export const usePageList = <T>(options: PageListOptions<T>) => {
  // 默认值处理
  options = {
    dataAppend: 'end',
    ...options,
  }

  const { getPageListApi, searchParams, dataAppend } = options

  // 定义 appendData 函数
  const appendData = (() => {
    if (dataAppend === 'start') {
      return (rows: T[]) => {
        list.value = [...rows, ...list.value]
      }
    } else if (dataAppend === 'end') {
      return (rows: T[]) => {
        list.value = [...list.value, ...rows]
      }
    }
  })()

  if (!isFunction(getPageListApi)) {
    throw Error(`getPageListApi: ${getPageListApi}，需要为函数`)
  }

  // 初始数据
  const originData: OriginData<T> = {
    list: [],
    page: 1,
    limit: 10,
    count: 0,
  }

  // 初始化数据
  const initData = () => {
    list.value = [...originData.list]
    page.value = originData.page
    limit.value = originData.limit
    count.value = originData.count
  }

  // 定义响应式变量
  const list = ref<T[]>([...originData.list]) as Ref<T[]>
  const page = ref(originData.page) as Ref<number>
  const limit = ref(originData.limit) as Ref<number>
  const count = ref(originData.count) as Ref<number>
  const loadding = ref(false) as Ref<boolean>
  const refreshing = ref(false) as Ref<boolean>

  // 获取分页列表数据
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

    if (res) {
      const { code, data, message } = res.data
      const { count: total, rows } = data

      if (code === HTTP_CODE.HTTP_SUCCESS_CODE) {
        if (rows.length) {
          appendData?.(rows)
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

  // 刷新列表
  const refreshPageList = async () => {
    initData()
    await getPageList()
  }

  // 处理刷新
  const handleRefresh = async () => {
    refreshing.value = true
    await refreshPageList().finally(() => {
      refreshing.value = false
    })
  }

  // 加载更多
  const loadMore = async () => {
    if (isNoMore.value) {
      return
    }
    await getPageList()
  }

  // 是否已无更多数据
  const isNoMore = computed(() => {
    return list.value.length >= count.value && page.value > 1
  })

  // 是否无数据
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
