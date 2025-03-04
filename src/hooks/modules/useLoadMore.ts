/**
 * @description: 加载更多
 */
import { debounce } from 'lodash-es'
import { onActivated, onBeforeUnmount, onDeactivated } from 'vue'

interface UseLoadMoreOptions {
  type?: 'top' | 'bottom' | 'both'
  scrollTopCallback?: () => void
  scrollBottomCallback?: () => void
  container?: HTMLElement
  distance?: number
}

export const useLoadMore = (options: UseLoadMoreOptions = {}) => {
  const {
    type = 'both',
    scrollTopCallback,
    scrollBottomCallback,
    container = document.documentElement,
    distance = 0,
  } = options

  // 判断滚动条是否滚动到顶部
  const isScrollTop = (distance: number = 0) => {
    const scrollTop = container.scrollTop
    return scrollTop - distance <= 0
  }

  // 判断滚动条是否滚动到底部
  const isScrollBottom = (distance: number = 0) => {
    const scrollHeight = container.scrollHeight
    const scrollTop = container.scrollTop
    const clientHeight = container.clientHeight
    return scrollHeight - distance <= scrollTop + clientHeight
  }

  // 滚动监听回调
  const handleScroll = debounce(() => {
    if (['top', 'both'].includes(type) && isScrollTop(distance)) {
      scrollTopCallback?.()
    }

    if (['bottom', 'both'].includes(type) && isScrollBottom(distance)) {
      scrollBottomCallback?.()
    }
  }, 300)

  container.addEventListener('scroll', handleScroll)

  onBeforeUnmount(() => {
    container.removeEventListener('scroll', handleScroll)
  })

  onActivated(() => {
    container.addEventListener('scroll', handleScroll)
  })

  onDeactivated(() => {
    container.removeEventListener('scroll', handleScroll)
  })

  return {
    isScrollTop,
    isScrollBottom,
  }
}
