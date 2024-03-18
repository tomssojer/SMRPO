<template>
  <v-dialog v-model="show" max-width="290">
    <v-card>
      <v-card-title class="headline">Select Organization</v-card-title>
      <v-card-text>
        <v-select
          :items="organizations"
          item-title="name"
          item-value="id"
          label="Select"
          v-model="selectedOrganization"></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" variant="text" @click="closeDialog"></v-btn>
        <v-btn color="green darken-1" text @click="enterOrganization">Enter</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<!-- <script setup lang="ts">
import { ref } from 'vue';

const show = ref(false);
const organizations = ref([]);
const selectedOrganization = ref(null);

const fetchOrganizations = async () => {
  // Fetch the organizations from the database
  // This is just a placeholder, replace it with your actual code
  console.log('Fetching organizations');
};

const enterOrganization = () => {
  // Do something with the selected organization
  console.log(selectedOrganization.value);
  show.value = false;
};

fetchOrganizations();
</script> -->

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { supabase } from '../lib/supabaseClient';
import router from '../router';
import store from '../store';

export default defineComponent({
  emits: ['update:show'],
  setup(_, { emit }) {
    const show = ref(false);
    const organizations = ref([]);
    const selectedOrganization = ref(null);

    const fetchOrganizations = async () => {
      const user = await supabase.auth.getUser();
      console.log('Fetching organizations');
      console.log('user', user);

      console.log('user', user?.data.user?.id)

      const { data: orgUserData, error: orgUserError } = await supabase
        .from('orgs_users') // Replace 'organizations' with your actual table name
        .select('*') // Fetch all columns
        .eq('user_id', user?.data.user?.id); // Only fetch organizations that belong to the current user

      const { data: allOrgs, error: allOrgsError } = await supabase
        .from('organization')
        .select('*');

      if (allOrgsError) throw allOrgsError;

      console.log('orgUserData', orgUserData);
      console.log('allOrgs', allOrgs);
      const filteredOrgs = allOrgs.filter((org) =>
        orgUserData.some((userOrg) => userOrg.org_id === org.id)
      );

      organizations.value = filteredOrgs;
      console.log('data', orgUserData);
    };

    const enterOrganization = () => {
      // Do something with the selected organization
      console.log('selectedOrganization', selectedOrganization.value);
      //store.commit('setOrganizationId', selectedOrganization.value);
      localStorage.setItem('organizationId', selectedOrganization.value);
      console.log(selectedOrganization.value);
      router.push('/');
      show.value = false;
    };

    const closeDialog = () => {
      show.value = false;
      emit('update:show', false);
      console.log('close dialog');
    };

    // Listen for authentication state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Fetch organizations when the user signs in
        fetchOrganizations();
      }
    });

    return {
      show,
      organizations,
      selectedOrganization,
      enterOrganization,
      closeDialog,
    };
  },
});
</script>
