import { useUserStore } from '@/store/modules/user.ts'
import { ElMessage } from 'element-plus'
import { io, Socket } from 'socket.io-client'
import { watch } from 'vue'

let socket: Socket | null = null

export const useSocket = () => {
  const userStore = useUserStore()

  const connectSocket = () => {
    watch(
      () => userStore.token,
      (token) => {
        if (token) {
          socket = io('http://localhost:3001', {
            auth: {
              token,
            },
          })

          // 全局消息监听
          socket.on('server:global-error-message', ({ message }: { message: string }) => {
            ElMessage.error({
              message,
              duration: 3000,
            })
          })
        }
      },
      {
        immediate: true,
      },
    )
  }

  return {
    socket,
    connectSocket,
  }
}
