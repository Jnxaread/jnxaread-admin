<template>
    <div class="pageView_board">
        <div class="function_box">
            <Button class="button_add" type="primary" @click="addBoard()">添加</Button>
        </div>
        <Table :columns="columns" :data="data"></Table>
        <Modal v-model="showModal" title="添加分类" okText="保存" @on-ok="saveBoard">
            <Form class="modal_form" :model="newBoard" :label-width="80">
                <FormItem label="版块名称">
                    <Input v-model="newBoard.name" size="large"/>
                </FormItem>
                <FormItem label="版块说明">
                    <Input v-model="newBoard.description" type="textarea" :rows="6"/>
                </FormItem>
                <FormItem label="限制等级">
                    <InputNumber v-model="newBoard.restricted" size="large" :max="5" :min="1" :rows="6"/>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "Board",
        data() {
            return {
                columns: [
                    {
                        title: '版块编号',
                        key: 'id',
                        width: 95,
                        align: 'center'
                    },
                    {
                        title: '版块名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '版块说明',
                        key: 'description',
                        align: 'center'
                    },
                    {
                        title: '公告数量',
                        key: 'noticeCount',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '主题数量',
                        key: 'topicCount',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '回复数量',
                        key: 'replyCount',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '限制性等级',
                        key: 'restricted',
                        width: 130,
                        align: 'center'
                    },
                ],
                data: [],
                showModal: false,
                newBoard: {
                    name: '',
                    description: '',
                    restricted: 0
                },
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.getBoards();
            },
            getBoards() {
                this.axios.post(this.api.forum.boards).then(response => {
                    let resp = response.data;
                    if (resp.status !== 200) {
                        this.$Message.error(resp.msg);
                        return;
                    }
                    this.data = resp.data;
                })
            },
            addBoard() {
                this.showModal = true;
            },
            saveBoard() {
                this.axios.post(this.api.forum.newBoard, this.newBoard).then(response => {
                    let resp = response.data;
                    if (resp.status !== 200) {
                        this.$Message.error(resp.msg);
                        return;
                    }
                    this.getBoards();
                })
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

    .modal_form {
        width: 95%;
        margin: 0 auto;
        padding: 10px 0 0 0;
    }
</style>
