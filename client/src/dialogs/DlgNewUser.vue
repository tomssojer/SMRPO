<template>
  <v-dialog v-model="show" class="dlgWindow" width="40%">
    <v-card :title="edit ? 'Edit user' : 'New user'">
      <v-form @submit.prevent>
        <v-card-text>
          <v-row dense>
            <v-text-field v-model="dlgData.user" label="Username" :rules="checkEmpty" required></v-text-field>
          </v-row>
          <v-row dense>
            <v-text-field
              v-model="dlgData.password"
              label="Password"
              type="password"
              :rules="checkEmpty" 
              required></v-text-field>
          </v-row>
          <v-row dense>
            <v-text-field v-model="dlgData.name" label="First name" :rules="checkEmpty" required></v-text-field>
          </v-row>
          <v-row dense>
            <v-text-field v-model="dlgData.surname" label="Last name" :rules="checkEmpty" required></v-text-field>
          </v-row>
          <v-row dense>
            <v-text-field v-model="dlgData.email" label="E-mail" :rules="checkEmpty" required></v-text-field>
          </v-row>
          <v-row>
            <v-radio-group
              v-model="dlgData.rights"
              inline
              label="Sistem rights:"
              :disabled="false">
              <v-radio label="Administrator" value="admin"></v-radio>
              <v-radio label="User" value="user"></v-radio>
            </v-radio-group>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" variant="text" @click="show = false"></v-btn>
          <v-btn class="bg-deep-purple" text="Save" variant="text" @click="saveNewUser" type="submit"></v-btn>
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { supabase } from '../lib/supabaseClient';

export default defineComponent({
  setup() {
    const show = ref(false);
    const edit = ref(false);
    const dlgData = ref({
      user: '',
      password: '',
      name: '',
      surname: '',
      email: '',
      rights: 'user',
    });
    const checkEmpty = [(value: string) => !!value || 'This field is required'];
    const saveNewUser = async () => {
      if (edit.value) {
        console.log('edit');
      }
      else {
        console.log(JSON.stringify(dlgData.value));
        const {data, error} = await supabase.from('user_profile').insert([{name: dlgData.value.name, surname: dlgData.value.surname}]).select();
        if(error)
          throw error;
        console.log(data);
        return data;
      }

    }

    return {
      show,
      edit,
      dlgData,
      checkEmpty,
      saveNewUser,
    };
  },
});
</script>
