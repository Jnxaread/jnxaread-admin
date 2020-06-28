<template>
    <div class="pageView_category">
        <div class="function_box">
            <Button class="button_add" type="primary" @click="addCategory()">添加</Button>
        </div>
        <Table :columns="columns" :data="data"></Table>
        <Modal v-model="showModal" title="添加分类" okText="保存" @on-ok="saveCategory">
            <Form class="modal_form" :model="newCategory" :label-width="80">
                <FormItem label="类别名称">
                    <Input v-model="newCategory.name" size="large"/>
                </FormItem>
                <FormItem label="类别说明">
                    <Input v-model="newCategory.description" type="textarea" :rows="6"/>
                </FormItem>
                <FormItem label="限制等级">
                    <InputNumber v-model="newCategory.restricted" size="large" :max="5" :min="1" :rows="6"/>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "Category",
        data() {
            return {
                columns: [
                    {
                        title: '类别编号',
                        key: 'id',
                        width: 95,
                        align: 'center'
                    },
                    {
                        title: '类别名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '类别说明',
                        key: 'description',
                        align: 'center'
                    },
                    {
                        title: '作品数量',
                        key: 'fictionCount',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '章节数量',
                        key: 'chapterCount',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '评论数量',
                        key: 'commentCount',
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
                newCategory: {
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
                this.getCategories();
            },
            getCategories() {
                this.axios.post(this.api.library.categories, this.form).then(response => {
                    let resp = response.data;
                    if (resp.status !== 200) {
                        this.$Message.error(resp.msg);
                        return;
                    }
                    this.data = resp.data;
                })
            },
            addCategory() {
                this.showModal = true;
            },
            saveCategory() {
                this.axios.post(this.api.library.newCategory, this.newCategory).then(response => {
                    let resp = response.data;
                    if (resp.status !== 200) {
                        this.$Message.error(resp.msg);
                        return;
                    }
                    this.getCategories();
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
