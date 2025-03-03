const main = {
  name: 'ContactsMain',
  path: '/contacts/main',
  component: () => import('@/view/contacts/index.vue'),
  meta: {
    icon: 'ri-contacts-book-3-line',
    activeIcon: 'ri-contacts-book-3-fill',
    title: '通讯录',
  },
}

const contacts = {
  path: '/contacts',
  redirect: '/contacts/main',
  children: [main],
}

export default contacts
