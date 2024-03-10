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
  <h1 class="text-lg underline">Hello world!dfas</h1>
  <button @click="signOut">Sign out</button>
</template>
