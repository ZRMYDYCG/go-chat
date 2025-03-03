const main = {
  name: 'SettingsMain',
  path: '/settings/main',
  component: () => import('@/view/settings/index.vue'),
  meta: {
    icon: 'ri-settings-line',
    activeIcon: 'ri-settings-fill',
    title: '设置',
  },
}

const settings = {
  path: '/settings',
  redirect: '/settings/main',
  children: [main],
}

export default settings
