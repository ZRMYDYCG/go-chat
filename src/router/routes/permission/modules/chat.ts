const main = {
  name: 'ChatMain',
  path: '/chat/main',
  component: () => import('@/view/chat/index.vue'),
  meta: {
    icon: 'ri-message-2-line',
    activeIcon: 'ri-message-2-fill',
    title: '聊天',
  },
}

const chat = {
  path: '/chat',
  redirect: '/chat/main',
  children: [main],
}

export default chat
