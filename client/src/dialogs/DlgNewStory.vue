<template>
  <v-dialog v-model="show" class="dlgWindow" width="50%">
    <v-card>
      <v-card-title>
        <p style="text-align:left;">
          {{ edit ? 'Edit user story' : 'New user story' }}
          <!-- <span style="float:right;">
            <v-icon>mdi-delete</v-icon>
          </span> -->
        </p>
      </v-card-title>
      <v-form @submit.prevent>
        <v-card-text>
          <v-row dense>
            <v-col cols="7">
              <v-text-field v-model="dlgData.name" label="Title" :rules="checkEmpty" :disabled="!isScrum && !isOwner" required></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select v-model="dlgData.priority" label="Priority" :items="prio" :rules="checkEmpty" :disabled="!isScrum && !isOwner" required></v-select>
            </v-col>
            <v-col>
              <v-text-field v-model="dlgData.work_value" label="Value" :rules="checkEmpty" :disabled="!isScrum && !isOwner" required></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-textarea
            label="Description"
            clearable
            v-model="dlgData.description"
            :disabled="!isScrum && !isOwner"
            ></v-textarea>
          </v-row>
          <v-row dense>
            <v-col cols="3">
              <v-text-field v-model="dlgData.time" label="Time cost" :disabled="!isScrum"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select v-model="dlgData.sprint_id" label="Sprint" :items="sprints" item-value="id" item-title="name" :disabled="!isScrum"></v-select>
            </v-col>
          </v-row>
          
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text="Save" variant="text" @click="saveStory" type="submit" :disabled="!isScrum && !isOwner"></v-btn>
          <v-btn text="Delete" variant="text" @click="deleteStory" type="submit" v-if="edit" :disabled="!isScrum && !isOwner"></v-btn>
          <v-spacer></v-spacer>
          <v-btn text="Close" variant="text" @click="show = false"></v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';
  import { supabase } from '../lib/supabaseClient';

  export default defineComponent({
    setup() {
      const show = ref(false);
      const edit = ref(false);
      const prio = ref(['Must have', 'Should have', 'Could have', 'Won\'t have this time']);
      const dlgData = ref<any>({
        name: '',
        priority: '',
        description: '',
        sprints: {id: null, name: ''},
        work_value: null,
        time: null,
        id: 0
      });
      const checkEmpty = [(value: string) => !!value || 'This field is required'];
      const sprints = ref<any[]>([]);
      const instance = ref<any>();
      const currentProjectId = ref(1);
      const isScrum = ref(false);
      const isOwner = ref(false);

      onMounted(() => {
        instance.value = getCurrentInstance();
        fetchSprints();
      });

      async function fetchSprints() {
        const organizationId = localStorage.getItem('organizationId');  
        const {data, error} = await supabase
        .from('project')
        .select('id, name, organization_id, sprints(*)')
        .eq('organization_id', organizationId);

        if (error) {
          console.error('Error fetching sprints', error);
        } else {
          data.forEach((project: any) => {
            project.sprints.forEach((sprint: any) => {
              sprints.value.push({id: sprint.id, name: sprint.name});
            });
          });
          console.log("SPRINTS");
          console.log(sprints.value);
        }
      }

      const saveStory = async () => {
        if(await checkDuplicate()) //če ime že obstaja, vrne true
          return;
        if (edit.value) {
          console.log('edit');
         // console.log(dlgData.value);
          if (dlgData.value.state === 'finished') {
            return;
          }
          if (dlgData.value.sprint !== null) {
            if (dlgData.value.time === null){
              return;
            }
          }
          const {data, error} = await supabase
            .from('user_story')
            .update([{
              sprint_id: dlgData.value.sprint_id,
              name: dlgData.value.name, 
              description: dlgData.value.description,
              project_id: currentProjectId.value,
              state: "idle",
              priority: dlgData.value.priority,
              work_value: dlgData.value.work_value,
              time: dlgData.value.time
            }])
            .eq('id', dlgData.value.id);
          
          if(error)
            throw error;

        }
        else {
          const {data, error} = await supabase
            .from('user_story')
            .insert([{
              sprint_id: dlgData.value.sprints.id,
              name: dlgData.value.name, 
              description: dlgData.value.description,
              project_id: currentProjectId.value,
              state: "idle",
              priority: dlgData.value.priority,
              work_value: dlgData.value.work_value,
              time: dlgData.value.time
            }]);
          if(error)
            throw error;
          console.log(data);
        }
        show.value = false;
      }

      async function checkDuplicate() {
        const {data, error} = await supabase
          .from('user_story')
          .select('id, name')
          .eq('name', dlgData.value.name)
          .neq('id', dlgData.value.id);
        if(error)
          return true;
        else
          return data.length != 0; 
      }

      async function deleteStory() {
        console.log(dlgData.value.id);
        const { error } = await supabase
          .from('user_story')
          .delete()
          .eq('id', dlgData.value.id);
          if(error)
            throw error;
          show.value = false;
      }
  
      return {
        show,
        edit,
        isScrum,
        isOwner,
        prio,
        dlgData,
        sprints,
        checkEmpty,
        currentProjectId,
        saveStory,
        deleteStory,
      };
    },
  });
  </script>
  