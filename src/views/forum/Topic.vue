<template>
    <div class="user_main">
        <Table :columns="columns" :data="topics"></Table>
        <div class="paging_box">
            <Page v-if="paging.total>0" :current="paging.currentPage" :page-size="paging.pageSize"
                  :total="paging.total" show-elevator @on-change="changePage"/>
        </div>

        <Modal class="modal" v-model="showModal" :title="topic.title" width="70" footer-hide>
            <div class="topic">
                <div class="detail">
                    <div class="title">【{{ topic.label }}】{{ topic.title }}</div>
                    <div class="info">
                        <div class="info_author">
                            <Icon class="authorIcon" type="md-person" size="22"/>
                            <span>{{ topic.username }}</span>
                        </div>
                        <div class="info_submitTime">
                            发表于
                            <Time v-if="topic.createTime" :time="topic.createTime"/>
                        </div>
                        <div class="info_floor">楼主</div>
                    </div>
                    <div class="content" v-html="topic.content"></div>
                </div>
                <div class="replyArea">
                    <div class="detail" v-for="(reply, index) in replies" :key="index">
                        <div class="info">
                            <div class="info_author">
                                <Icon class="authorIcon" type="md-person" size="22"/>
                                <span>{{ reply.username }}</span>
                            </div>
                            <div class="info_submitTime">
                                发表于
                                <Time v-if="topic.createTime" :time="reply.createTime"/>
                            </div>
                            <div class="info_floor">{{ reply.floor }}楼</div>
                        </div>
                        <div class="content">
                            <div v-if="reply.quote!==0">
                                <div class="reply_quote" v-if="screenWidth>600">
                                    <div class="quote_icon_e">
                                        <div class="reply_quote_head">
                                            <span class="reply_quote_info">
                                                {{ reply.quotedReply.username }} 发表于
                                                <Time :time="reply.quotedReply.createTime" type="datetime"/>
                                            </span>
                                            <span class="reply_quote_floor">
                                                {{ reply.quotedReply.floor }}楼
                                            </span>
                                        </div>
                                        <span class="modal_reply_overflow_page" v-html="reply.quotedReply.content"/>
                                    </div>
                                </div>
                                <div class="reply_quote" v-else>
                                    <div class="reply_quote_head">
                                        <span class="font_quote">引用 @</span>
                                        <span class="reply_quote_info">{{ reply.quotedReply.username }}</span>
                                        <span class="font_quote"> 发表的</span>
                                        <span class="reply_quote_floor">{{ reply.quotedReply.floor }}楼</span>
                                    </div>
                                    <div class="modal_reply_overflow" v-html="reply.quotedReply.content"></div>
                                </div>
                            </div>
                            <span v-html="reply.content"></span>
                        </div>
                        <div class="reply_operate">
                            <Button type="warning" size='small' class="button_delete" @click="hideReply(reply.id)">
                                隐藏
                            </Button>
                            <Button type="error" size='small' class="button_delete" @click="deleteReply(reply.id)">
                                删除
                            </Button>
                        </div>
                    </div>
                    <div class="paging_box">
                        <Page v-if="paging.total>0" :current="paging.currentPage" :page-size="paging.pageSize"
                              :total="paging.total" show-elevator @on-change="changeReplyPage"/>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
let moment = require("moment");
export default {
    name: "Topic",
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
                    //align: 'center',
                    render: (h, params) => {
                        let titleClass;
                        if (params.row.visible === 0) {
                            titleClass = 'table_title_hided';
                        } else {
                            titleClass = 'table_title';
                        }
                        return h('a', {
                            class: titleClass,
                            on: {
                                click: () => {
                                    this.replies = [];
                                    this.replyPaging.currentPage = 1;
                                    this.topicId = params.row.id;
                                    this.getTopic(this.topicId);
                                }
                            }
                        }, params.row.title);
                    }
                },
                {
                    title: '作者',
                    key: 'username',
                    width: 200,
                    align: 'center'
                },
                {
                    title: '发布时间',
                    key: 'submitTime',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, this.dateFormat(params.row.createTime));
                    }
                },
                {
                    title: '最后回复',
                    key: 'lastReply',
                    width: 200,
                    align: 'center',
                },
                {
                    title: '最后回复时间',
                    key: 'lastSubmit',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, this.dateFormat(params.row.lastSubmit));
                    }
                },
                {
                    title: '回复数量',
                    width: 95,
                    key: 'replyCount',
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
                    width: 190,
                    align: 'center',
                    /*render: (h, params) => {
                        return h('Button', {
                            props: {
                                size: 'small',
                                type: 'error'
                            },
                            on: {
                                click: () => {
                                    this.deleteTopic(params.row.id);
                                }
                            }
                        }, '删除')
                    }*/
                    render: (h, params) => {
                        let lockedButton;
                        let lockedType;
                        let locked;
                        if (params.row.locked === true) {
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
                            visibleBtn = '显示';
                            visibleType = 'success';
                            visible = 1;
                        } else {
                            visibleBtn = '隐藏';
                            visibleType = 'warning';
                            visible = 0;
                        }
                        return h('div',
                                [
                                    h('Button', {
                                        props: {
                                            type: lockedType,
                                            size: 'small',
                                            ghost: true,
                                        },
                                        on: {
                                            click: () => {
                                                this.lockTopic(params.row.id, locked)
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
                                                this.updateVisibleOfTopic(params.row.id, visible);
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
            topics: [],
            topic: {},
            replies: [],
            topicId: null,
            paging: {
                currentPage: 1,
                pageSize: 100,
                total: 0,
            },
            replyPaging: {
                currentPage: 1,
                pageSize: 50,
                total: 0,
            },
            showModal: false,
        }
    },
    created: function () {
        this.init();
    },
    methods: {
        init() {
            this.getAllTopic();
        },
        getAllTopic() {
            let params = {
                'page': this.paging.currentPage
            };
            this.axios.post(this.api.forum.topics, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.topics = resp.data.topicList;
                this.paging.total = resp.data.topicCount;
            })
        },
        getTopic() {
            let params = {
                'id': this.topicId,
                'page': this.replyPaging.currentPage,
            };
            this.axios.post(this.api.forum.topicDetail, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    this.$router.push('/');
                    return;
                }
                this.topic = resp.data.topic;
                this.replies = resp.data.replies;
                this.replyPaging.total = resp.data.replyCount;
                this.showModal = true;
            });
        },
        lockTopic(id, locked) {
            let params = {
                'id': id,
                'locked': locked
            };
            this.axios.post('/lockTopic', params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getAllTopic();
                this.showModal = false;
                this.$Message.success('操作成功！');
            })
        },
        updateVisibleOfTopic(id, visible) {
            let params = {
                'id': id,
                'visible': visible
            };
            this.axios.post(this.api.forum.topicVisible, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getAllTopic();
                this.showModal = false;
                this.$Message.success('操作成功！');
            })
        },
        deleteTopic(id) {
            let params = {
                'id': id
            };
            this.axios.post('/deleteTopic', params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getAllTopic();
                this.showModal = false;
                this.$Message.success('删除成功！');
            })
        },
        deleteReply(id) {
            let params = {
                'id': id
            };
            this.axios.post(this.api.forum.deleteReply, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.$Message.success('删除成功！');
                this.getTopic();
            });
        },
        changePage(page) {
            this.paging.currentPage = page;
            this.getAllTopic();
        },
        changeReplyPage(page) {
            this.replyPaging.currentPage = page;
            this.getTopic();
        },
        dateFormat: function (tick) {
            return moment(tick).format("YYYY-MM-DD HH:mm:ss");
        },
    }
}
</script>

<style scoped lang="scss">
.topic {
    width: 100%;
}

.detail {
    width: 100%;
    background-color: #f5f5f5;
    border: 1px solid #c4c4c4;
    border-radius: 6px;
    padding: 20px 35px;
    margin-bottom: 6px;
}

.title {
    font-size: 1.6em;
    font-weight: bold;
    margin-bottom: 15px;
    border-bottom: 3px solid #1c5899;
}

.info {
    font-size: 1.1em;
    padding-bottom: 2px;
    border-bottom: 1px solid #c4c4c4;
}

.info_author {
    display: inline-block;
    padding: 0 15px;
    border-right: 2px solid #a9a9a9;

    span {
        margin-left: 5px;
    }
}

.info_submitTime {
    display: inline-block;
    padding: 0 15px;
    color: #808695;
}

.info_submitTime_mobile {
    display: none;
}

.info_floor {
    float: right;
}

.content {
    font-size: 1.3em;
    line-height: 38px;
    padding: 15px;
}

.replyArea {
    padding-bottom: 5px;
    overflow: hidden;
}

.reply_quote {
    width: 100%;
    margin: 10px 0px 0 0px;
    padding: 10px 10px 10px 65px;
    border-radius: 10px;
    background: #e8eaec url("../../assets/icons/icon_quote_s.gif") no-repeat 20px 6px;
}

.quote_icon_e {
    padding: 0px 65px 10px 0px;
    background: url("../../assets/icons/icon_quote_e.gif") no-repeat 98% 100%;
}

.reply_quote_info {
    font-size: 1em;
    color: #808695;
}

.reply_quote_floor {
    font-size: 1.2em;
    font-weight: bold;
    color: darkgrey;
    margin-left: 15px;
}

.reply_operate {
    width: 100%;
    height: 50px;
    user-select: none;
    line-height: 50px;
    padding: 0 15px 5px 15px;
    background: url("../../assets/icons/lattice.png") left top repeat-x;

    Button {
        margin-right: 10px;
    }
}

.paging_box {
    float: right;
    margin: 5px 45px 0px 0px;
}

.submitArea {
    width: 100%;
    background-color: #f5f5f5;
    border: 1px solid #c4c4c4;
    border-radius: 6px;
    padding: 35px 35px 25px 35px;
    margin-top: 30px;
}

.submit_button {
    width: 120px;
}

.ivu-btn {
    border: 0;
    box-shadow: none;
    background-color: #999;
}

.modal_reply /deep/ .ivu-modal-body {
    padding: 45px 30px 30px 30px !important;
}

.modal_reply_overflow_page {
    width: 958px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.modal_reply_overflow {
    width: 800px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
