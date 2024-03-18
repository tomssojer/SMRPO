<template>
  <v-btn class="bg-deep-purple new-project-button" theme="dark" v-if="isAdmin" @click="openModal">New project</v-btn>
  <v-dialog v-model="isModalOpen" style="max-width: 800px">
    <v-card>
      <v-card-title class="headline">Create a new project</v-card-title>
      <v-card-text>
        <v-form>
          <v-row dense>
            <v-col cols="6">
              <v-text-field v-model="name" label="Name"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="selected_date" label="Start date" @click="showDatePicker = true"
                prepend-icon="mdi-calendar" readonly></v-text-field>
              <v-date-picker v-model="selected_date" v-if="showDatePicker" no-title range></v-date-picker>
            </v-col>
          </v-row>
          <v-textarea v-model="description" label="Describe this project"></v-textarea>
          <v-row>
            <v-col cols="12">
              <v-select v-model="productOwner" :items="user_names" label="Product Owner"
                :rules="[(v) => !!v || 'A product owner is required']">
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select v-model="scrumMaster" :items="user_names" item-text="name" item-value="id" label="Scrum Master"
                :rules="[(v) => !!v || 'A scrum master is required']"></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select v-model="developers" :items="user_names" item-text="name" item-value="id" label="Developers"
                multiple :rules="[(v) => !!v || 'Developers are required']"></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="bg-deep-purple" @click="createProject" style="margin: 0 0 20px 20px">Create</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="isModalOpen = false" style="margin: 0 20px 20px 0">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div v-if="isLoading">Loading...</div>
  <v-data-table v-else :headers="headers" :items="items"></v-data-table>
</template>

<script setup lang="ts">
import { supabase } from "../lib/supabaseClient";
import { onMounted, ref, watchEffect } from 'vue';
import { formatDate, formatDateTime } from '../lib/dateFormatter';

onMounted(() => {
  getProjects();
  getUsers();
})

const name = ref('');
const description = ref('');
const users = ref<any[]>([]);

const productOwner = ref(null);
const scrumMaster = ref(null);
const developers = ref([]);

const isAdmin = ref(false);
const isModalOpen = ref(false);
const isLoading = ref(true);
const items = ref<any[]>([]);

const selected_date = ref([]);
const showDatePicker = ref(false);

const user_names = ref<string[]>([]);

const isFormValid = ref(false);

const headers = ref([
  { title: 'Name', key: 'name' },
  { title: 'Created at', key: 'created_at' },
  { title: 'Start date', key: 'start_date' },
  { title: 'Deadline', key: 'deadline' },
]);

const openModal = () => {
  isModalOpen.value = true;
};

supabase.auth.onAuthStateChange(async (_, session) => {
  if (session) {
    const jwt = session.access_token;

    const payload = JSON.parse(atob(jwt.split('.')[1]));
    isAdmin.value = payload.user_role === 'admin';
  } else {
    console.log('The user is not authenticated');
  }
});


async function getProjects() {
  const organizationId = localStorage.getItem('organizationId');
  console.log('organizationId', organizationId);
  const { data, error } = await supabase
    .from('project')
    .select('name, created_at, start_date, deadline')
    .eq('organization_id', organizationId);

  if (error) {
    console.error('Error fetching projects');
  } else {
    items.value = data;
    items.value.forEach((item: any) => {
      item.created_at = formatDateTime(item.created_at);
    });
    items.value.forEach((item: any) => {
      item.start_date = formatDate(item.start_date);
      item.deadline = formatDate(item.deadline);
    });
    isLoading.value = false;
  }
}

async function getUsers() {
  const { data, error } = await supabase
    .from('user_profile')
    .select('id, name, surname');

  if (error) {
    console.error("Error fetching users")
  } else {
    console.log(data)
    users.value = data;

    data.forEach((element: { name: string, surname: string }) =>
      user_names.value.push(element.name + " " + element.surname));
  }
}

async function createProject(this: any) {
  if (!isFormValid.value) return;

  const { data, error } = await supabase
    .from('project')
    .insert([{
      name: name.value,
      description: description.value,
      organization_id: localStorage.getItem('organizationId'),
    }]);

  if (error) {
    console.error("Error creating project")
  } else {
    getProjects();
    isModalOpen.value = false;
    const projectId = data[0].id;

    await supabase
      .from('project_role')
      .insert([
        { project_id: projectId, user_id: productOwner.value, role: 'product_owner' },
        { project_id: projectId, user_id: scrumMaster.value, role: 'scrum_master' },
        ...developers.value.map((id: number) => ({ project_id: projectId, user_id: id, role: 'developer' }))
      ]);

    if (error) {
      console.error("Error creating project role")
    } else {
      getProjects();
      isModalOpen.value = false;
    }
  }
}


const validateForm = (formItems: any) => {
  return formItems.every((item: any) => !!item);
}

watchEffect(() => {
  isFormValid.value = validateForm([name.value, productOwner.value, scrumMaster.value, developers.value]);
});
</script>

