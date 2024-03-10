// useAuth.js
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const session = ref(null);
  const router = useRouter();

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    session.value = data?.session;
    console.log(session.value)
    if (session.value) {
      router.push('/');
    }
  };

  const onAuthStateChange = () => {
    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session;
      if (session.value) {
        router.push('/');
      }
    });
  };

  return { session, checkSession, onAuthStateChange };
}