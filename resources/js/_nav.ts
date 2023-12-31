export default [
    {
      component: 'CNavItem',
      name: 'Главная',
      to: '/dashboard',
      icon: 'cilHome',
    },
    {
      component: 'CNavItem',
      name: 'TG Bots',
      to: '/bots',
      icon: 'cibTelegramPlane',
    },
    {
        component: 'CNavItem',
        name: 'Логи',
        to: '/logs',
        icon: 'cilInfo',
    },
    {
        component: 'CNavItem',
        name: 'Заблокированные чаты',
        to: '/block/chats',
        icon: 'cilAirplaneModeOff',
    }
  ]
