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
              <h4 style="text-align:left;" class="card-title">{{ item.raw.name + " (" + item.raw.priority + ") "}} </h4>
            </v-card-title>
            <v-card-text>
              {{ item.raw.description }}
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
    const stories = ref([]);
    // const stories = ref([] as { name: string; surname: string}[]);

    // onMounted(async () => {
    //   const {data, error} = await supabase.from('user_profile').select('*');
    //   // const {data, error} = await supabase.from('user_profile, user_roles').select('name, surname').eq('user_roles.role', 'user');
    //   users.value = data;
    //   return data;
    // })
    const dlgNewStory = ref(null);
    const dlgEditStory = ref(null);
    const currentProjectId = ref(1);

    onMounted(() => {
        fetchStories();
      });
    
    async function fetchStories() {
      const {data, error} = await supabase
        .from('user_story')
        .select('id, sprints(id, name), project_id, name, description, state, priority, work_value, time')
        .eq('project_id', currentProjectId.value);
      if (error) {
        console.error('Error fetching stories', error);
      } else {
        data.forEach((story: any) => {
          if(story.sprints == null)
            story.sprints = {name: ''};
          stories.value.push(story);
        });
        console.log("STORIES");
        console.log(stories.value);
        console.log(stories.value[0].sprints.name);
      }
      stories.value = data;
    }

    function newStory() {
      dlgNewStory.value.edit = false;
      dlgNewStory.value.show = true;
      
    }
    function editStory(item: any) {
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

<style scoped>
.card-title {
  max-width: 100%;
  height: auto;
  min-height: 32px;
  white-space: pre-wrap;
}

</style>