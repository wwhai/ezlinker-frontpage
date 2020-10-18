import {uniqueId} from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath(menu) {
    return menu.map(e => ({
        ...e,
        path: e.path || uniqueId('d2-menu-empty-'),
        ...e.children ? {
            children: supplementPath(e.children)
        } : {}
    }))
}

export const menuHeader = supplementPath([{
        path: '/index',
        title: '系统首页',
        icon: 'home'
    }])

export const menuAside = supplementPath([
    {
        path: '/index',
        title: '系统首页',
        icon: 'home'
    },
    {
        path: '/project',
        title: '项目管理',
        icon: 'bars'
    },
    {
        path: '/project/deviceList',
        title: '设备管理',
        icon: 'connectdevelop'
    },
    {
        path: '/schedule',
        title: '调度任务',
        icon: 'braille'
    }, {
        path: '/cloudfunc',
        title: '云端函数',
        icon: 'rocket'
    },
    {
        path: '/systemSettings',
        title: '系统配置',
        icon: 'fa fa-cogs'
    }
    // {
    //     path: '/rewriter',
    //     title: '分发引擎',
    //     icon: 'assistive-listening-systems'
    // },
    // {
    //     path: '/codegen',
    //     title: '代码生成器',
    //     icon: 'assistive-listening-systems'
    // },
])
