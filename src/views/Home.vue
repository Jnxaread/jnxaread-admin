<template>
    <div class="home">
        <Layout>
            <Sider class="sider" :style="{ minHeight: minHeight + 'px' }" ref="side1" hide-trigger collapsible
                   :collapsed-width="78" v-model="isCollapsed">
                <div class="logo">
                    <img v-show="!isCollapsed" src="../assets/logo.png" width="122px" height="27px">
                </div>
                <MyMenu :isCollapsed="isCollapsed"></MyMenu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu"
                          size="24"></Icon>
                    <Button type="info" class="logout" @click="logout()">退出登录</Button>
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                    <router-view/>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
    // @ is an alias to /src
    import MyMenu from '../components/MyMenu.vue';

    export default {
        name: 'home',
        components: {
            MyMenu,
        },
        data() {
            return {
                isCollapsed: false,
                minHeight: null,
                navigator: 'mainPage',
            }
        },
        mounted() {
            this.minHeight = document.documentElement.clientHeight;
        },
        computed: {
            rotateIcon() {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
        },
        methods: {
            collapsedSider() {
                this.$refs.side1.toggleCollapse();
            },
            logout() {
                this.axios.post(this.api.user.logout).then(() => {
                    /*let resp = response.data;
                    if (resp.status != 200) {
                        this.$Message['error']({
                            background: true,
                            content: resp.message
                        });
                    }*/
                    this.$Message['success']({
                        background: true,
                        content: '退出成功'
                    });
                    sessionStorage.removeItem('user');
                    this.$router.push('/login').then();
                });
            },
        }
    }
</script>

<style scoped>
    .home {
        width: 100%;
        height: 100%;
        background: #f5f7f9;
        position: relative;
        overflow: hidden;
    }

    .layout-header-bar {
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    }

    .sider {
        background-color: #20222A;
    }

    .logo {
        height: 65px;
        text-align: center;
        padding-top: 18px;
        background-color: #20222A;
        border-bottom: 1px solid gray;
    }

    .logout {
        float: right;
        margin-top: 16px;
        margin-right: 20px;
    }

</style>
