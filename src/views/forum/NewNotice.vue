<template>
    <div class="main">
        <h3 class="tab_title">发表公告</h3>
        <Divider/>
        <div class="container">
            <div class="notice_top">
                <div class="notice_label">
                    <Input v-model="notice.label" maxlength="4" size="large" placeholder="四字标签" style="width: 86px;"/>
                </div>
                <div class="notice_title">
                    <Input v-model="notice.title" maxlength="35" show-word-limit size="large" placeholder="请输入标题" style="width: 43%;"/>
                    <span>最多输入35个字符</span>
                </div>
                <div class="notice_position">
                    <Input v-model="notice.position" type="number" size="large" placeholder="请指定位置" style="width: 120px;"/>
                </div>
            </div>
            <div class="notice_content">
                <editor ref="editor"></editor>
                <Button class="submit_button" type="primary" size="large" @click="submitNotice()">发表公告</Button>
            </div>
        </div>
    </div>
</template>

<script>
import Editor from '../../components/Editor'

export default {
    name: "SubmitNotice",
    components: {Editor},
    data() {
        return {
            notice: {
                id: null,
                boardId: 1,
                label: '',
                title: '',
                content: '',
                position: null,
            }
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let id = this.$route.query.id;
            if (id == null) {
                return;
            }
            this.getNoticeDetail(id);
        },
        getNoticeDetail(id) {
            let params = {
                'id': id,
            };
            this.axios.post(this.api.forum.noticeDetail, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    this.$router.push('/');
                    return;
                }
                this.notice.id = resp.data.id;
                this.notice.label = resp.data.label;
                this.notice.title = resp.data.title;
                this.notice.content = resp.data.content;
                this.notice.position = resp.data.position;
                this.$store.commit('setContent', this.notice.content);
                this.$refs.editor.setContent();
            });
        },
        submitNotice() {
            this.$refs.editor.getContent();
            if (this.notice.label === '') {
                this.$Message.error('请输入公告标签！');
                return;
            }
            let reg = /^[\u4e00-\u9fa5]{2,4}$/;
            if (!reg.test(this.notice.label)) {
                this.$Message.error('标签为2至4位汉字');
                return;
            }
            if (this.notice.title === '') {
                this.$Message.error('请输入标题！');
                return;
            }
            if (this.notice.title.length < 4) {
                this.$Message.error('公告标题的长度不得低于4个字符');
                return;
            }
            if (this.notice.position == null) {
                this.$Message.error('请指定公告位置');
                return;
            }
            let validate = this.$store.getters.getContent;
            let validateA = validate.replace(/ /g, '');
            let validateB = validateA.replace(/<p>/g, '');
            let validateC = validateB.replace(/<\/p>/g, '');
            let validateD = validateC.replace(/&nbsp;/g, '');
            let validateE = validateD.replace(/<br>/g, '');
            if (validateE.length === 0) {
                this.$Message.error('请输入内容！');
                return;
            }
            this.notice.content = this.$store.getters.getContent;
            if (this.notice.id == null) {
                this.axios.post('/forum/new/notice', this.notice).then(response => {
                    let resp = response.data;
                    if (resp.status !== "000000") {
                        this.instance('error', resp.msg);
                        return;
                    }
                    this.$router.push('/notice');
                });
            } else {
                this.axios.post('/editNotice', this.notice).then(response => {
                    let resp = response.data;
                    if (resp.status !== "000000") {
                        this.instance('error', resp.msg);
                        return;
                    }
                    this.$Message.success('编辑成功！');
                    this.$router.push('/notice');
                });
            }
        },
        instance(type, content) {
            switch (type) {
                case 'success':
                    this.$Modal.success({
                        title: '操作成功！',
                        content: content,
                        onOk: () => {
                            this.$router.push('/');
                        },
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title: '操作失败！',
                        content: content
                    });
                    break;
            }
        }
    },
}
</script>

<style scoped>
.main {
    width: 100%;
    border-radius: 10px;
    background-color: #fff;
}

.tab_title {
    margin: 20px 30px;
}

.container {
    width: 90%;
    padding: 0px 30px;
    margin: 20px auto;
}

.notice_top {
    width: 100%;
    margin-top: 20px;
}

.notice_label {
    width: 20%;
    display: inline;
}

.notice_title {
    width: 80%;
    margin-left: 15px;
    display: inline;
}

.notice_position {
    margin-left: 40px;
    display: inline;
}

.notice_title Input {
    display: inline;
}

.notice_title span {
    display: inline;
    font-size: 1.15em;
    margin-left: 15px;
    line-height: 38px;
}

.notice_content {
    width: 100%;
    margin-top: 15px;
}

.submit_button {
    width: 120px;
}
</style>
