<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h1>Prijava</h1>
    <form @submit.prevent="login">
      <table>
        <tr>
          <td><label>Uporabniško ime: </label></td>
          <td><input type="text" id="username" v-model="username" autocomplete="off" pattern="^[a-zA-ZšđčćžŠĐČĆŽ]+[a-zA-ZšđčćžŠĐČĆŽ\d]*$" required autofocus /></td>
        </tr>
        <tr>
          <td><label>Geslo: </label></td>
          <td><input type="password" id="password" v-model="password" pattern="^[a-zA-ZšđčćžŠĐČĆŽ\d]+$" required /></td>
        </tr>
      </table>
    <p><button @click="login">Prijava</button></p>
    </form>

  </div>
</template>

<script>
import axios from 'axios';
import router from '../router'
export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      await axios.post("http://localhost:3000/data/user", {username: this.username, password: this.password})
      .then(response => {
        if(response.data.length > 0){
          localStorage.setItem('userData', JSON.stringify(response.data[0]));
          router.push("/home");
        }
      })
      .catch(error => {
        console.error(error);
      })

    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 20px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
