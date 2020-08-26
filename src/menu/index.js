import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  { path: '/index', title: '系统首页', icon: 'home' }
  // {
  //   title: '页面',
  //   icon: 'folder-o',
  //   children: [
  //     { path: '/page1', title: '页面 1' },
  //     { path: '/page2', title: '页面 2' },
  //     { path: '/page3', title: '页面 3' }
  //   ]
  // }
])

export const menuAside = supplementPath([
  { path: '/index', title: '系统首页', icon: 'home' },
  // {
  //   title: '资源管理',
  //   icon: 'folder-o',
  //   children: [
  // { path: '/resource/product', title: '产品搜索' }
  // { path: '/page3', title: '页面 3' }
  // ]
  // },
  { path: '/project', title: '项目管理', icon: 'bars' },
  { path: '/product', title: '产品管理', icon: 'microchip' },
  { path: '/device', title: '设备管理', icon: 'connectdevelop' },
  { path: '/schedule', title: '调度任务', icon: 'braille' },
  { path: '/cloudfunc', title: '云端函数', icon: 'rocket' },
  { path: '/rewriter', title: '分发引擎', icon: 'assistive-listening-systems' },
])
