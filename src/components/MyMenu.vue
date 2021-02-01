<template>
    <Menu :active-name="navigator" theme="dark" width="auto" :class="menuitemClasses">
        <MenuItem name="mainPage" to="/">
            <Icon type="md-home"/>
            <span>主页</span>
        </MenuItem>
        <MenuItem name="user" to="/user">
            <Icon type="md-people"/>
            <span>用户</span>
        </MenuItem>
        <MenuItem name="category" to="/category">
            <Icon custom="iconfont icon-category" />
            <span>分类</span>
        </MenuItem>
        <MenuItem name="fiction" to="/fiction">
            <Icon type="ios-book" />
            <span>作品</span>
        </MenuItem>
        <MenuItem name="board" to="/board">
            <Icon custom="iconfont icon-board" />
            <span>版块</span>
        </MenuItem>
        <MenuItem name="announcement" to="/notice">
            <Icon type="md-flag"/>
            <span>公告</span>
        </MenuItem>
        <MenuItem name="topic" to="/topic">
            <Icon type="ios-paper"/>
            <span>帖子</span>
        </MenuItem>
        <MenuItem name="chart" to="/">
            <Icon type="md-trending-up"/>
            <span>图表</span>
        </MenuItem>
        <MenuItem name="project" to="/project">
            <Icon type="md-trending-up"/>
            <span>版本</span>
        </MenuItem>
        <MenuItem name="setting" to="/">
            <Icon type="ios-settings"></Icon>
            <span>设置</span>
        </MenuItem>
    </Menu>
</template>

<script>
    export default {
        name: "MyMenu",
        props: {
            isCollapsed: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                navigator: 'mainPage',
            }
        },
        computed: {
            menuitemClasses() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
        }
    }
</script>

<style scoped>
    @import "../assets/icons/category/iconfont.css";
    @import "../assets/icons/board/iconfont.css";

    .menu-item span {
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }

    .collapsed-menu span {
        width: 0px;
        transition: width .2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

    .ivu-menu-dark {
        background-color: #20222A;
    }

    .ivu-menu-item {
        height: 60px;
        font-size: 16px;
    }

    .ivu-menu-vertical .ivu-menu-item {
        padding: 19px 24px;
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        color: rgb(255, 208, 75);
    }
</style>
