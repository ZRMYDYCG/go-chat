const main = {
  name: 'FriendMain',
  path: '/friend/main',
  component: () => import('@/view/friend/index.vue'),
  meta: {
    icon: 'ri-settings-line',
    activeIcon: 'ri-settings-fill',
    title: '朋友圈',
  },
}

const settings = {
  path: '/friend',
  redirect: '/friend/main',
  children: [main],
}

export default settings
