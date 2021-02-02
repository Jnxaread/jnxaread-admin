<template>
    <div>
        <div class="function_box">
            <Button class="button_add" type="primary" @click="addVersion()">添加</Button>
        </div>
        <Table :columns="columns" :data="data"></Table>
        <div class="paging_box">
            <Page v-if="paging.total>0" :current="paging.currentPage" :page-size="paging.pageSize"
                  :total="paging.total" show-elevator @on-change="changePage"/>
        </div>
        <Modal v-model="showModal" title="发布版本" okText="保存" @on-ok="saveVersion">
            <Form class="modal_form" :model="newVersion" :label-width="80">
                <FormItem label="版本号">
                    <label>
                        <Input v-model="newVersion.version" size="large"/>
                    </label>
                </FormItem>
                <FormItem label="版本信息">
                    <label>
                        <Input v-model="newVersion.versionInfo" type="textarea" :rows="6"/>
                    </label>
                </FormItem>
                <FormItem label="系统类别">
                    <label>
                        <Select class="new_system" v-model="newVersion.system">
                            <Option value="0">客户端系统</Option>
                            <Option value="1">服务端系统</Option>
                            <Option value="2">后台管理系统</Option>
                            <Option value="3">后台服务系统</Option>
                        </Select>
                    </label>
                </FormItem>
                <FormItem label="版本状态">
                    <label>
                        <Select class="new_system" v-model="newVersion.status">
                            <Option value="0">未上线</Option>
                            <Option value="1">已上线</Option>
                            <Option value="2">已下线</Option>
                            <Option value="3">已废弃</Option>
                        </Select>
                    </label>
                </FormItem>
            </Form>
        </Modal>
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
                    align: 'center'
                },
                {
                    title: '版本',
                    key: 'version',
                    align: 'center'
                },
                {
                    title: '系统类别',
                    key: 'system',
                    align: 'center'
                },
                {
                    title: '发布人',
                    key: 'username',
                    align: 'center'
                },
                {
                    title: '版本状态',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '发布时间',
                    key: 'createTime',
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, this.dateFormat(params.row.createTime));
                    }
                },
            ],
            data: [],
            paging: {
                currentPage: 1,
                pageSize: 100,
                total: 0,
            },
            showModal: false,
            newVersion: {
                version: "",
                versionInfo: "",
                system: "",
                status: "",
            }
        }
    },
    created: function () {
        this.init();
    },
    methods: {
        init() {
            this.getAllVersion();
        },
        getAllVersion() {
            let params = {
                page: this.paging.currentPage
            };
            this.axios.post(this.api.project.version, params).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.data = resp.data;
            })
        },
        addVersion() {
            this.showModal = true;
        },
        changePage(page) {
            this.paging.currentPage = page;
            this.getAllUser();
        },
        dateFormat: function (tick) {
            return moment(tick).format("YYYY-MM-DD HH:mm:ss");
        },
        saveVersion() {
            this.axios.post(this.api.project.newVersion, this.newVersion).then(response => {
                let resp = response.data;
                if (resp.status !== "000000") {
                    this.$Message.error(resp.msg);
                    return;
                }
                this.getAllVersion();
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

.paging_box {
    float: right;
    margin: 20px 45px 30px 0;
}

.new_system {
    width: 200px;
}
</style>