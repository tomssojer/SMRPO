<template>
  <v-data-iterator
    :items="stories"
    item-value="name"
  >
    <template v-slot:default="{ items }">
      <v-row>
        <v-col
          v-for="item in items"
          :key="item.raw.title"
          cols="12"
          lg="3"
          md="3"
          sm="6"
        >
          <v-card @click="editStory(item)">
            <v-card-title class="d-flex align-center">
              <h4>{{ item.raw.title + " (" + item.raw.prio + ") "}} </h4>
            </v-card-title>
            <v-card-text>
              {{ item.raw.descr }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
  <v-btn @click="newStory" class="dlgButton">New user story</v-btn>
  <dlg-new-story ref="dlgNewStory"></dlg-new-story>
  <dlg-new-story ref="dlgEditStory"></dlg-new-story>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';
import DlgNewStory from '../dialogs/DlgNewStory.vue';

export default defineComponent({
  components: {
    DlgNewStory
  },
  setup() {
    const show = ref(false);
    const search = ref('');
    const stories = ref([ //temp data
      {
        title: "Story 1",
        prio: "Must have",
        descr: "Namesto opisa zgodbe so lahko tukaj prikazane podnaloge in časovna zahtevnost",
        bValue: "10"
      },
      {
        title: "Story 2",
        prio: "Should have",
        descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        bValue: "5"
      },
      {
        title: "Story 3",
        prio: "Could have",
        descr: "Basic description",
        bValue: "3"
      },
      {
        title: "Story 4",
        prio: "Could have",
        descr: "Basic description",
        bValue: "3"
      },
      {
        title: "Story 5",
        prio: "Could have",
        descr: "Basic description",
        bValue: "3"
      }]);
    // const stories = ref([] as { name: string; surname: string}[]);

    // onMounted(async () => {
    //   const {data, error} = await supabase.from('user_profile').select('*');
    //   // const {data, error} = await supabase.from('user_profile, user_roles').select('name, surname').eq('user_roles.role', 'user');
    //   users.value = data;
    //   return data;
    // })
    const dlgNewStory = ref(null);
    const dlgEditStory = ref(null);

    function newStory() {
      dlgNewStory.value.edit = false;
      dlgNewStory.value.show = true;
      
    }
    function editStory(item) {
      console.log(item)
      dlgEditStory.value.dlgData = item.raw;
      dlgEditStory.value.edit = true;
      dlgEditStory.value.show = true;
      
    }

    return {
      show,
      search,
      stories,
      dlgEditStory,
      dlgNewStory,
      newStory,
      editStory
    };
  },
});
</script>
