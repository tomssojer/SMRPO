<template>
  <v-dialog v-model="show" class="dlgWindow" width="50%">
    <v-card>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line></v-text-field>
      </template>
      <v-data-table
        density="compact"
        :headers="headers"
        :items="users"
        :search="search"
        @click:row="editUser">
      </v-data-table>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" variant="text" @click="show = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <dlg-new-user ref="dlgEditUser"></dlg-new-user>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import DlgNewUser from '../dialogs/DlgNewUser.vue';

export default defineComponent({
  components: {
    DlgNewUser,
  },
  setup() {
    const show = ref(false);
    const search = ref('');
    const headers = ref([
      {
        align: 'start',
        key: 'user',
        sortable: false,
        title: 'Uporabnik',
      },
      {
        key: 'email',
        title: 'E-mail',
      },
    ]);
    const users = ref([
      {
        user: 'Janez',
        email: 'Janez@Novak.si',
      },
      {
        user: 'Jana',
        email: 'Jana@Horvat.com',
      },
    ]);
    const dlgEditUser = ref(null);

    function editUser(click, item) {
      console.log(item.item);
      dlgEditUser.value.dlgData = item.item;
      dlgEditUser.value.edit = true;
      dlgEditUser.value.show = true;
    }

    return {
      show,
      search,
      headers,
      users,
      dlgEditUser,
      editUser,
    };
  },
});
</script>
