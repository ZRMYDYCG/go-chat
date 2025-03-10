const main = {
  name: 'NoteMain',
  path: '/note/main',
  component: () => import('@/view/note/index.vue'),
  meta: {
    icon: 'ri-contacts-book-3-line',
    activeIcon: 'ri-contacts-book-3-fill',
    title: '笔记',
  },
}

const contacts = {
  path: '/file',
  redirect: '/note/main',
  children: [main],
}

export default contacts
