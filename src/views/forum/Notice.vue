<template>
    <div>
        <div class="function_box">
            <Button class="button_add" type="primary" @click="addNotice()">添加</Button>
        </div>
        <Table :columns="columns" :data="data"></Table>
        <div class="paging_box">
            <Page v-if="paging.total>0" :current="paging.currentPage" :page-size="paging.pageSize"
                  :total="paging.total" show-elevator @on-change="changePage"/>
        </div>
        <Modal class="modal" v-model="showModal" :title="notice.title" width="50" footer-hide>
            <div class="topic">
                <div class="topic_top">
                    <div class="topic_label">【<span>{{ notice.label }}</span>】</div>
                    <div class="topic_title">{{ notice.title }}</div>
                </div>
                <div class="topic_head">
                    <div class="topic_author">{{ notice.username }}</div>
                    <div class="topic_time">发表于 {{ notice.createTime | dateFormat }}</div>
                    <Button type="warning" size='small' class="button_delete" @click="deleteNotice(notice.id)">删除
                    </Button>
                </div>
                <div class="topic_content" v-html="notice.content"></div>
            </div>
        </Modal>
    </div>
</template>

<script>
let moment = require("moment");
export default {
    name: "Notice",
    data() {
        return {
            columns: [
                {
                    title: '标签',
                    key: 'label',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '标题',
                    key: 'title',
                    render: (h, params) => {
                        let titleClass;
                        if (params.row.hided === true) {
                            titleClass = 'table_title_hided';
                        } else {
                            titleClass = 'table_title';
                        }
                        return h('a', {
                            class: titleClass,
                            on: {
                                click: () => {
                                    this.currentNoticeId = params.row.id;
                                    this.getNoticeDetail();
                                }
                            }
                        }, params.row.title);
                    }
                },
                {
                    title: '作者',
                    key: 'username',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '发布时间',
                    key: 'createTime',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, this.dateFormat(params.row.createTime));
                    }
                },
                {
                    title: '最后编辑',
                    key: 'lastEdit',
                    width: 200,
                    align: 'center',
                },
                {
                    title: '最后编辑时间',
                    key: 'lastTime',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, this.dateFormat(params.row.lastTime));
                    }
                },
                {
                    title: '位置',
                    key: 'position',
                    width: 95,
                    align: 'center'
                },
                {
                    title: '查看数量',
                    width: 95,
                    key: 'viewCount',
                    align: 'center'
                },
                {
                    title: '操作',
                    width: 300,
                    align: 'center',
                    render: (h, params) => {
                        let lockedButton;
                        let lockedType;
                        let locked;
                        if (params.row.locked) {
                            lockedButton = '解锁';
                            lockedType = 'success';
                            locked = 0;
                        } else {
                            lockedButton = '锁定';
                            lockedType = 'warning';
                            locked = 1;
                        }

                        let visibleBtn;
                        let visibleType;
                        let visible;
                        if (params.row.visible === 0) {
                            visibleBtn = '上架';
                            visibleType = 'success';
                            visible = 1;
                        } else {
                            visibleBtn = '下架';
                            visibleType = 'warning';
                            visible = 0;
                        }
                        return h('div',
                                [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small',
                                        },
                                        on: {
                                            click: () => {
                                                this.upToTop(params.row.id);
                                            }
                                        }
                                    }, '置顶'),
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small',
                                        },
                                        style: {
                                            marginLeft: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.editNotice(params.row.id);
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        props: {
                                            type: lockedType,
                                            size: 'small',
                                            ghost: true,
                                        },
                                        style: {
                                            marginLeft: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.lockNotice(params.row.id, locked);
                                            }
                                        }
                                    }, lockedButton),
                                    h('Button', {
                                        props: {
                                            type: visibleType,
                                            size: 'small',
                                        },
                                        style: {
                                            marginLeft: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.hideNotice(params.row.id, visible);
                                            }
                                        }
                                    }, visibleBtn),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                        },
                                        style: {
                                            marginLeft: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteNotice(params.row.id);
                                            }
                                        }
                                    }, '删除'),
                                ]
                        );
                    }
                },
            ],
            data: [],
            notice: {},
            paging: {
                currentPage: 1,
                pageSize: 50,
                total: 0,
            },
            showModal: false,
            currentNoticeId: null,
        }
    },
    created: function () {
        this.init();
    },
    methods: {
        init() {
            this.getNotices();
        },
        getNotices() {
            let params = {
                page: this.paging.currentPage
            };
            this.axios.post(this.api.forum.notices, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.data = resp.data.notices;
                this.paging.total = resp.data.count;
            })
        },
        getNoticeDetail() {
            let params = {
                id: this.currentNoticeId,
            };
            this.axios.post(this.api.forum.noticeDetail, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    this.$router.push('/');
                    return;
                }
                this.notice = resp.data;
                this.showModal = true;
            });
        },
        addNotice() {
            this.$router.push('/toSubmitNotice');
        },
        upToTop(id) {
            let params = {
                id: id
            };
            this.axios.post(this.api.forum.topNotice, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getNotices();
                this.$Message.success('操作成功！');
            });
        },
        editNotice(id) {
            this.$router.push('/toSubmitNotice?id=' + id);
        },
        lockNotice(id, locked) {
            let params = {
                id: id,
                locked: locked
            };
            this.axios.post(this.api.forum.lockNotice, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getNotices();
                this.showModal = false;
                this.$Message.success('操作成功！');
            });
        },

        /**
         * 下架公告
         * @param id 公告ID
         * @param visible 操作
         */
        hideNotice(id, visible) {
            let params = {
                id: id,
                visible: visible
            };
            this.axios.post(this.api.forum.hideNotice, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getNotices();
                this.showModal = false;
                this.$Message.success('操作成功！');
            })
        },
        deleteNotice(id) {
            let params = {
                id: id
            };
            this.axios.post('/deleteNotice', params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getNotices();
                this.showModal = false;
                this.$Message.success('删除成功！');
            })
        },
        changePage(page) {
            this.paging.currentPage = page;
            this.getNotices();
        },
        dateFormat: function (tick) {
            return moment(tick).format("YYYY-MM-DD HH:mm:ss");
        },
    }
}
</script>

<style scoped>

.function_box {
    overflow: hidden;
    margin: 15px 20px;
}

.button_add {
    float: right;
    /*margin-right: 45px;*/
    width: 80px;
}

.paging_box {
    float: right;
    margin: 20px 45px 30px 0;
}

.topic {
    width: 98%;
    padding: 20px;
    margin: 0 auto;
    border-radius: 10px;
    border: 2px solid #819799;
}

.topic_top {
    width: 100%;
    border-bottom: 3px solid #1c5899;
}

.topic_label {
    display: inline;
}

.topic_label span {
    color: #ff78f2;
}

.topic_title {
    display: inline;
    padding: 10px 5px;
    font-size: 1.5em;
    font-weight: bold;
}

.topic_head {
    width: 100%;
    font-size: 1.2em;
    margin-top: 25px;
    border-bottom: 1px solid #999;
}

.topic_author {
    color: #27313e;
    display: inline;
    padding: 0px 15px;
    border-right: 2px solid darkgrey;
}

.topic_time {
    color: cadetblue;
    display: inline;
    padding: 0 15px;
}

.topic_content {
    width: 100%;
    padding: 0 15px;
    margin-top: 25px;
    font-size: 1.3em;
    color: black;
}

.button_delete {
    float: right;
}

</style>

<style>

.table_title {
    font-size: 1.2em;
    font-weight: bold;
    color: #515a6e;
}

.table_title_hided {
    font-size: 1.2em;
    font-weight: bold;
    color: #c5c8ce;
}

.table_title:hover {
    color: #2d8cf0;
}

</style>
