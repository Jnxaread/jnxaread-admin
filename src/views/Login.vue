<template>
    <div class="login_page">
        <div class="login_container">
            <h2 class="login_title">系统登录</h2>
            <Form class="form" :model="form">
                <FormItem>
                    <Input v-model="form.account" size="large" placeholder="请输入管理员账号"/>
                </FormItem>
                <FormItem>
                    <Input v-model="form.password" type="password" size="large" placeholder="请输入密码"/>
                </FormItem>
                <FormItem>
                    <Button class="login_button" type="primary" size="large" @click="login()">登录</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                form: {
                    account: '',
                    password: '',
                },
            }
        },
        methods: {
            login() {
                this.axios.post(this.api.user.login, this.form).then(response => {
                    let resp = response.data;
                    if (resp.status !== 200) {
                        this.$Message.error(resp.msg);
                        return;
                    }
                    sessionStorage.setItem('user', JSON.stringify(resp.data));
                    this.$router.push('/').then();
                })
            }
        }
    }
</script>

<style scoped>
    .login_page {
        width: 100%;
        height: 100%;
        position: fixed;
        background-color: #20222A;
    }

    .login_container {
        width: 400px;
        height: 300px;
        margin: 200px auto;
        padding: 20px 25px;
        background-color: #fff;
        border-radius: 8px;
        text-align: center;
    }

    .login_title {
        margin-top: 10px;
        margin-bottom: 25px;
    }

    .login_button {
        margin-top: 20px;
        width: 100%;
    }

</style>
