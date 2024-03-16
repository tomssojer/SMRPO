<script setup lang="ts">
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import Organization from './Organization.vue';
import Project from './Project.vue';
import User from './User.vue';

defineProps<{ msg: string }>();

const router = useRouter();

const signOut = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};
const store = useStore();

// Access the session from the store
const userRole = computed(() => store.state.userRole);

console.log('user role', userRole.value);
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer class="bg-deep-purple" theme="dark" permanent>
        <v-list color="transparent">
          <v-list-item
            @click="selected = Organization"
            prepend-icon="mdi-domain"
            title="Organizations"></v-list-item>
          <v-list-item
            @click="selected = Project"
            prepend-icon="mdi-view-dashboard"
            title="Projects"></v-list-item>
          <v-list-item
            @click="selected = User"
            prepend-icon="mdi-account-box"
            title="Users"></v-list-item>
          <v-btn @click="$refs.dlgUserStory.show = true" class="dlgButton">New user story</v-btn>
          <dlg-new-story ref="dlgUserStory"></dlg-new-story>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block @click="signOut"> Logout </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main>
        <component :is="selected" />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import DlgNewStory from '../dialogs/DlgNewStory.vue';
export default {
  data() {
    return {
      selected: Organization, // Add this line
    };
  },
};
</script>
