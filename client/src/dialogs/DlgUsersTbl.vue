<template>
  <!-- <v-dialog v-model="show" class="dlgWindow" width="50%"> -->
    <v-card>
      <template v-slot:text>
        <v-text-field 
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          density="compact"></v-text-field>
      </template>
      <v-data-table
        density="compact"
        :headers="headers"
        :items="users"
        :search="search"
        @click:row="editUser">
      </v-data-table>
    </v-card>

  <!-- </v-dialog> -->
  <dlg-new-user ref="dlgEditUser"></dlg-new-user>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';
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
        key: 'name',
        sortable: false,
        title: 'Name',
      },
      {
        key: 'surname',
        title: 'Surname',
      },
    ]);
    let users = ref([] as { name: string; surname: string}[]);
    const dlgEditUser = ref(null);

    function editUser(click, item) {
      dlgEditUser.value.dlgData = item.item;
      dlgEditUser.value.edit = true;
      dlgEditUser.value.show = true;
      
    }

    onMounted(async () => {
      const {data, error} = await supabase.from('user_profile').select('*');
      // const {data, error} = await supabase.from('user_profile, user_roles').select('name, surname').eq('user_roles.role', 'user');
      users.value = data;
      return data;
    })


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
