const main = {
  name: 'AlbumMain',
  path: '/album/main',
  component: () => import('@/view/album/index.vue'),
  meta: {
    icon: 'ri-contacts-book-3-line',
    activeIcon: 'ri-contacts-book-3-fill',
    title: '相册',
  },
}

const contacts = {
  path: '/album',
  redirect: '/album/main',
  children: [main],
}

export default contacts
