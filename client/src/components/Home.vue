<script setup lang="ts">
import { jwtDecode } from "jwt-decode";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabaseClient";

defineProps<{ msg: string }>();

const count = ref(0);
const router = useRouter();

const signOut = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};

const { subscription: authListener } = supabase.auth.onAuthStateChange(
  async (event, session) => {
    if (session) {
      console.log(session);
      const jwt = jwtDecode(session.access_token);
      console.log(jwt);
    }
  }
);
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        class="bg-deep-purple"
        theme="dark"
        permanent
      >
        <v-list color="transparent">
          <v-list-item prepend-icon="mdi-domain" title="Organizations"></v-list-item>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Projects"></v-list-item>
          <v-list-item prepend-icon="mdi-account-box" title="Users"></v-list-item>
          
          <v-btn @click="$refs.dlgNewUser.edit = false; $refs.dlgNewUser.show = true" class="dlgButton">Nov uporabnik</v-btn>
          <dlg-new-user ref="dlgNewUser"></dlg-new-user>
          <v-btn @click="$refs.dlgUsersTbl.show = true" class="dlgButton">Uredi uporabnike</v-btn>
          <dlg-users-tbl ref="dlgUsersTbl"></dlg-users-tbl>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block @click="signOut">
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import DlgNewUser from '../dialogs/DlgNewUser.vue';
import DlgNewProj from '../dialogs/DlgNewProj.vue';
import DlgUsersTbl from '../dialogs/DlgUsersTbl.vue';
export default {
  data() {
    return {
     }
  },

};
</script>
