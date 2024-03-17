<template>
  <v-btn class="bg-deep-purple new-project-button" theme="dark" v-if="isAdmin" @click="openModal"
    >New project</v-btn
  >
  <v-dialog v-model="isModalOpen">
    <v-card>
      <v-card-title class="headline">Modal title</v-card-title>
      <v-card-text>Modal content...</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="isModalOpen = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div v-if="isLoading">Loading...</div>
  <v-data-table v-else :items="items" :headers="headers"></v-data-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '../lib/supabaseClient';

onMounted(() => {
  getProjects();
});

const isAdmin = ref(false);
const isModalOpen = ref(false);
const isLoading = ref(true);

const headers = ref([
  { text: 'Name', value: 'name' },
  { text: 'Created at', value: 'created_at' },
  { text: 'Start date', value: 'start_date' },
  { text: 'Deadline', value: 'deadline' },
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

const items = ref<any[]>([]);

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
    isLoading.value = false;
  }
}
</script>
