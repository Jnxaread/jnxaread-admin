<template>
    <div class="user_main">
        <Table :columns="columns" :data="data"></Table>
        <div class="paging_box">
            <Page v-if="paging.total>0" :current="paging.currentPage" :page-size="paging.pageSize"
                  :total="paging.total" show-elevator @on-change="changePage"/>
        </div>
    </div>
</template>

<script>
let moment = require("moment");
export default {
    name: "User",
    data() {
        return {
            columns: [
                {
                    title: 'ID',
                    key: 'id',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '账号',
                    key: 'account',
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'username',
                    // width: 200,
                    align: 'center'
                },
                {
                    title: '邮箱',
                    key: 'email',
                    align: 'center'
                },
                {
                    title: '性别',
                    key: 'gender',
                    // width: 90,
                    align: 'center',
                    render: (h, params) => {
                        let gender_CN;
                        if (params.row.gender === 0) {
                            gender_CN = '女';
                        } else if (params.row.gender === 1) {
                            gender_CN = '男';
                        } else {
                            gender_CN = '未知';
                        }
                        return h('span', {}, gender_CN);
                    }
                },
                {
                    title: '发帖数量',
                    key: 'topicCount',
                    width: 95,
                    align: 'center'
                },
                {
                    title: '回复数量',
                    key: 'replyCount',
                    width: 95,
                    align: 'center'
                },
                {
                    title: '登录次数',
                    key: 'loginCount',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '注册时间',
                    key: 'createTime',
                    width: 240,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, this.dateFormat(params.row.createTime));
                    }
                },
                {
                    title: '操作',
                    width: '120',
                    align: 'center',
                    render: (h, params) => {
                        let lockedButton;
                        let lockedType;
                        let locked;
                        if (params.row.locked === true) {
                            lockedButton = '解封';
                            lockedType = 'success';
                            locked = 0;
                        } else {
                            lockedButton = '封禁';
                            lockedType = 'warning';
                            locked = 1;
                        }
                        let disabled = false;
                        let user = JSON.parse(sessionStorage.getItem('user'));
                        if (params.row.id === 1 || params.row.id === user.id) {
                            disabled = true;
                        }
                        return h('Button', {
                            props: {
                                size: 'small',
                                type: lockedType,
                                disabled: disabled,
                            },
                            on: {
                                click: () => {
                                    this.lockUser(params.row.id, locked);
                                }
                            }
                        }, lockedButton);
                    }
                }
            ],
            data: [],
            paging: {
                currentPage: 1,
                pageSize: 100,
                total: 0,
            },
        }
    },
    created: function () {
        this.init();
    },
    methods: {
        init() {
            this.getAllUser();
        },
        getAllUser() {
            let params = {
                page: this.paging.currentPage
            };
            this.axios.post(this.api.user.list, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.data = resp.data;
                // this.paging.total = resp.data.userCount;
            })
        },
        lockUser(id, locked) {
            let params = {
                id: id,
                locked: locked
            };
            this.axios.post('/lockUser', params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getAllUser();
                this.$Message.success('操作成功！');
            })
        },
        changePage(page) {
            this.paging.currentPage = page;
            this.getAllUser();
        },
        dateFormat: function (tick) {
            return moment(tick).format("YYYY-MM-DD HH:mm:ss");
        },
    }
}
</script>

<style scoped>
.paging_box {
    float: right;
    margin: 20px 45px 30px 0;
}
</style>
