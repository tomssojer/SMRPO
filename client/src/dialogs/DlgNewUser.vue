<template>
  <v-dialog v-model="show" class="dlgWindow" width="40%">
    <v-card :title="edit ? 'Uredi uporabnika' : 'Nov uporabnik'">
      <v-card-text>
        <v-row dense>
          <v-text-field v-model="dlgData.user" label="Uporabniško ime" required></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field
            v-model="dlgData.password"
            label="Geslo"
            type="password"
            required></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="dlgData.fname" label="Ime" required></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="dlgData.lname" label="Priimek" required></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="dlgData.email" label="E-mail" required></v-text-field>
        </v-row>
        <v-row>
          <v-radio-group
            v-model="dlgData.rights"
            inline
            label="Sistemske pravice:"
            :disabled="false">
            <v-radio label="Administrator" value="admin"></v-radio>
            <v-radio label="Uporabnik" value="user"></v-radio>
          </v-radio-group>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" variant="text" @click="show = false"></v-btn>
        <v-btn text="Save" variant="text" @click="saveNewUser"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const show = ref(false);
    const edit = ref(false);
    const dlgData = ref({
      user: '',
      password: '',
      fname: '',
      lname: '',
      email: '',
      rights: 'user',
    });

    function saveNewUser() {
      if (edit.value) {
        console.log('edit');
      }
      console.log(JSON.stringify(dlgData.value));
    }

    return {
      show,
      edit,
      dlgData,
      saveNewUser,
    };
  },
});
</script>
