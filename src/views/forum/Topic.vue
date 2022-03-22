<template>
    <div class="user_main">
        <Table :columns="columns" :data="data"></Table>
        <div class="paging_box">
            <Page v-if="paging.total>0" :current="paging.currentPage" :page-size="paging.pageSize"
                  :total="paging.total" show-elevator @on-change="changePage"/>
        </div>

        <Modal class="modal" v-model="showModal" :title="topic.title" width="50" footer-hide>
            <div class="topic">
                <div class="topic_top">
                    <div class="topic_label">【<span>{{ topic.label }}</span>】</div>
                    <div class="topic_title">{{ topic.title }}</div>
                </div>
                <div class="topic_head">
                    <div class="topic_author">{{ topic.username }}</div>
                    <div class="topic_time">发表于 {{ topic.createTime | dateFormat }}</div>
                    <Button type="warning" size='small' class="button_delete" @click="deleteTopic(topic.id)">删除</Button>
                    <div class="floor">楼主</div>
                </div>
                <div class="topic_content" v-html="topic.content"></div>
            </div>
            <div class="reply" v-for="(reply, index) in pageReplyList" :key="index">
                <div class="reply_head">
                    <div class="reply_author">{{ reply.username }}</div>
                    <div class="reply_time">发表于 {{ reply.createTime | dateFormat }}</div>
                    <Button type="warning" size='small' class="button_delete" @click="deleteReply(reply.id)">删除</Button>
                    <div class="floor">{{ reply.floor }}楼</div>
                </div>
                <div class="reply_content">
                    <div class="reply_quote" v-if="reply.quote!==0">
                        <div class="quote_icon_e" v-if="replyList[reply.quoteIndex]">
                            <div class="reply_quote_head">
                                <span class="reply_quote_info">
                                    {{ replyList[reply.quoteIndex].username }} 发表于
                                    {{ replyList[reply.quoteIndex].createTime | dateFormat }}
                                </span>
                                <span class="reply_quote_floor">
                                    {{ replyList[reply.quoteIndex].floor }}楼
                                </span>
                            </div>
                            <span v-html="replyList[reply.quoteIndex].content"></span>
                        </div>
                    </div>
                    <span v-html="reply.content"></span>
                </div>
            </div>
            <div class="replyPaging_box">
                <Page class="replyPaging" v-if="replyPaging.total>0" :current="replyPaging.currentPage"
                      :page-size="replyPaging.pageSize"
                      :total="replyPaging.total" show-elevator @on-change="changeReplyPage"/>
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
                        if (params.row.visible === 1) {
                            titleClass = 'table_title_hided';
                        } else {
                            titleClass = 'table_title';
                        }
                        return h('a', {
                            class: titleClass,
                            on: {
                                click: () => {
                                    this.replyList = [];
                                    this.currentTopicId = params.row.id;
                                    this.getTopicDetail();
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

                        let hidedButton;
                        let hidedType;
                        let visible;
                        if (params.row.visible === 1) {
                            hidedButton = '显示';
                            hidedType = 'success';
                            visible = 0;
                        } else {
                            hidedButton = '隐藏';
                            hidedType = 'warning';
                            visible = 1;
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
                                            type: hidedType,
                                            size: 'small',
                                        },
                                        style: {
                                            marginLeft: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.hideTopic(params.row.id, visible);
                                            }
                                        }
                                    }, hidedButton),
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
            topic: {},
            replyList: [],
            pageReplyList: [],
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
            currentTopicId: null,
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
            this.axios.post('/allTopic', params).then(response => {
                let resp = response.data;
                if (resp.status != "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.data = resp.data.topicList;
                this.paging.total = resp.data.topicCount;
            })
        },
        getTopicDetail() {
            let params = {
                'id': this.currentTopicId,
                'page': this.replyPaging.currentPage,
            };
            this.axios.post('/topic', params).then(response => {
                let resp = response.data;
                if (resp.status != "000000") {
                    this.$Message.error(resp.msg);
                    this.$router.push('/');
                    return;
                }
                this.topic = resp.data.topic;
                this.pageReplyList = resp.data.replyList;
                for (let i = 0; i < this.pageReplyList.length; i++) {
                    if (this.pageReplyList[i].quote != 0) {
                        this.pageReplyList[i].quoteIndex = this.pageReplyList[i].quote - 1;
                    }
                }
                let lastIndex_f = this.replyList.length - 1;
                if (this.replyList.length == 0 || this.replyList[lastIndex_f].floor < resp.data.replyList[0].floor) {
                    for (let i = 0; i < resp.data.replyList.length; i++) {
                        this.replyList.push(resp.data.replyList[i]);
                    }
                }
                let lastIndex_s = this.replyList.length - 1;
                let respLastIndex = resp.data.replyList.length - 1;
                if (this.replyList.length != 0 && this.replyList[lastIndex_s].floor >= resp.data.replyList[0].floor && this.replyList[lastIndex_s].floor < resp.data.replyList[respLastIndex].floor) {
                    for (let i = 0; i < resp.data.replyList.length; i++) {
                        if (this.replyList[lastIndex_s].floor < resp.data.replyList[i].floor) {
                            this.replyList.push(resp.data.replyList[i]);
                        }
                    }
                } else if (this.replyList.length != 0 && this.replyList[0].floor < resp.data.replyList[0].floor && this.replyList[lastIndex_s].floor > resp.data.replyList[respLastIndex].floor) {
                    for (let i = 0; i < this.replyList.length; i++) {
                        if (this.replyList[i].floor == resp.data.replyList[0].floor) {
                            break;
                        } else if (this.replyList[i].floor > resp.data.replyList[0].floor) {
                            for (let j = 0; j < resp.data.replyList.length; j++) {
                                this.replyList.splice(i, 0, resp.data.replyList[j]);
                            }
                            break;
                        }
                    }
                }
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
                if (resp.status != "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getAllTopic();
                this.showModal = false;
                this.$Message.success('操作成功！');
            })
        },
        hideTopic(id, hided) {
            let params = {
                'id': id,
                'hided': hided
            };
            this.axios.post('/hideTopic', params).then(response => {
                let resp = response.data;
                if (resp.status != "000000") {
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
                if (resp.status != "000000") {
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
            this.axios.post('/deleteReply', params).then(response => {
                let resp = response.data;
                if (resp.status != "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.$Message.success('删除成功！');
                this.getTopicDetail();
            })
        },
        changePage(page) {
            this.paging.currentPage = page;
            this.getAllTopic();
        },
        changeReplyPage(page) {
            this.replyPaging.currentPage = page;
            this.getTopicDetail();
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
    margin: 20px 45px 30px 0px;
}

.topic {
    width: 98%;
    padding: 20px;
    margin: 0px auto;
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
    padding: 0px 15px;
}

.topic_content {
    width: 100%;
    padding: 0px 15px;
    margin-top: 25px;
    font-size: 1.3em;
    color: black;
}

.reply {
    width: 96%;
    padding: 20px;
    margin: 10px auto;
}

.reply_head {
    width: 100%;
    font-size: 1.2em;
    border-bottom: 1px solid #999;
}

.reply_author {
    color: #27313e;
    display: inline;
    padding: 0px 15px;
    border-right: 2px solid darkgrey;
}

.reply_time {
    color: cadetblue;
    display: inline;
    padding: 0px 15px;
}

.floor {
    float: right;
    margin-right: 15px;
}

.reply_content {
    width: 100%;
    padding: 0px 15px;
    margin-top: 25px;
    font-size: 1.3em;
    color: #515a6e;
}


.reply_quote {
    width: 100%;
    margin: 10px 0px 25px 0px;
    padding: 10px 10px 10px 65px;
    background: #f1f2f3 url("../../assets/icons/icon_quote_s.gif") no-repeat 20px 6px;
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

.replyPaging_box {
    overflow: hidden;
}

.replyPaging {
    float: right;
    margin: 0px 45px 0px 0px;
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
