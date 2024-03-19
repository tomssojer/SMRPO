<template>
  <div style="height: 100vh; overflow: hidden;">
    <div style="margin: 30px auto; max-width: 80%;">
      <v-btn class="bg-deep-purple" theme="dark" style="margin: 30px 0;" v-if="isAdmin" @click="openModal">
        New project
      </v-btn>

      <v-dialog v-model="isModalOpen" style="max-width: 800px;">
        <v-card>
          <v-card-title class="headline">Create a new project</v-card-title>
          <v-card-text>
            <v-form ref="createForm">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field v-model="name" label="Name" :rules="checkEmpty('Name')"></v-text-field>
                </v-col>
              </v-row>
              <v-textarea v-model="description" label="Describe this project" :rules="checkEmpty('Description')"></v-textarea>
              <v-row>
                <v-col cols="12">
                  <v-select v-model="productOwner" :items="user_names" label="Product Owner"
                  :rules="checkEmpty('Product Owner')">
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select v-model="scrumMaster" :items="user_names" item-text="name" item-value="id"
                    label="Scrum Master" :rules="checkEmpty('Scrum Master')"></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select v-model="developers" :items="user_names" item-text="name" item-value="id" label="Developers"
                    multiple :rules="checkEmpty('Developers', true)"></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="bg-deep-purple" @click="createProject" style="margin: 0 0 20px 20px">Create</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="isModalOpen = false, showDatePicker = false" style="margin: 0 20px 20px 0">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="isEditModalOpen" style="max-width: 800px">
        <v-card>
          <v-card-title class="headline">Edit project</v-card-title>
          <v-card-text>
            <v-form ref="updateForm">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field v-model="selectedProject.name" :rules="checkEmpty('Name')" label="Name"></v-text-field>
                </v-col>
              </v-row>
              <v-textarea v-model="selectedProject.description" :rules="checkEmpty('Description')" label="Describe this project"></v-textarea>
              <v-row>
                <v-col cols="12">
                  <v-select v-model="selectedProject.productOwner" :items="user_names" label="Product Owner"
                  :rules="checkEmpty('Product Owner')">
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select v-model="selectedProject.scrumMaster" :items="user_names" item-text="name" item-value="id"
                    label="Scrum Master" :rules="checkEmpty('Scrum Master')"></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select v-model="selectedProject.developers" :items="user_names" item-text="name" item-value="id"
                    label="Developers" multiple :rules="checkEmpty('Developers', true)"></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="bg-deep-purple" @click="updateProject" style="margin: 0 0 20px 20px">Update</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="isModalOpen = false, showDatePicker = false" style="margin: 0 20px 20px 0">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div v-if="isLoading">Loading...</div>
      <v-data-table style="margin: auto;" v-else :headers="headers" :items="items" show-expand>
        <template v-slot:item.action="{ item }">
          <v-btn class="bg-deep-purple" size="30" @click="openEditModal(item)">
            <v-icon size="medium20">mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          Description: {{ item.description }}
        </td>
      </tr>
    </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "../lib/supabaseClient";
import { onMounted, ref } from 'vue';
import { formatDate, formatDateTime } from '../lib/dateFormatter';
import { de } from "vuetify/locale";

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

const showDatePicker = ref(false);

const user_names = ref<string[]>([]);

const createForm = ref(null);
const updateForm = ref(null);


const checkEmpty = (field, isMultiple = false) => {
  return isMultiple
    ? [(v) => (v && v.length > 0) || `${field} are required`]
    : [(v) => !!v || `${field} is required`];
};

const headers = ref([
  { title: 'Name', key: 'name' },
  {title: 'Project id', key: 'id'},
  { title: 'Created at', key: 'created_at' },
  { title: '', key: 'action', sortable: false },
]);

const selectedProject = ref({
  name: '',
  description: '',
  productOwner: '',
  scrumMaster: '',
  developers: [],
});
const isEditModalOpen = ref(false);

async function openEditModal(project: any) {
  if (project) {
    project.developers = [];

    await supabase
      .from('project_role')
      .select('user_id, role')
      .eq('project_id', project.id)
      .then(async ({ data, error }) => {
        if (error) {
          console.error('Error fetching project roles');
        } else {
          for (const role of data) {
            const user = (await supabase.auth.getUser()).data.user;
            const userId = user?.id;

            const username = await supabase
              .from('user_profile')
              .select('name, surname')
              .eq('user_id', userId)
              .single();

            if (username.data) {
              if (role.role === 'product_owner') {
                project.productOwner = username.data.name + " " + username.data.surname;
              } else if (role.role === 'scrum_master') {
                project.scrumMaster = username.data.name + " " + username.data.surname;
              } else if (role.role === 'developer') {
                project.developers = project.developers || [];
                project.developers.push(username.data.name + " " + username.data.surname);
              }
            }
          }
        }
      });
    selectedProject.value = Object.assign({}, project);
    isEditModalOpen.value = true;
    showDatePicker.value = false;
  } else {
    console.log("Error opening edit modal")
  }
}

const openModal = () => {
  isModalOpen.value = true;
  showDatePicker.value = false;
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
  const { data, error } = await supabase
    .from('project')
    .select('*')
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
    users.value = data;
    data.forEach((element: { name: string, surname: string }) =>
      user_names.value.push(element.name + " " + element.surname));
  }
}

async function createProject(this: any) {
  createForm.value.validate();
  const isFormValid = validateForm([name.value, productOwner.value, scrumMaster.value, developers.value]);
  if (!isFormValid) return;

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
    
    const po = await supabase
      .from('user_profile')
      .select('user_id')
      .eq('name', productOwner.value.split(' ')[0])
      .eq('surname', productOwner.value.split(' ')[1])
      .single();

    const sm = await supabase
      .from('user_profile')
      .select('user_id')
      .eq('name', scrumMaster.value.split(' ')[0])
      .eq('surname', scrumMaster.value.split(' ')[1])
      .single();

    const devs = await supabase
      .from('user_profile')
      .select('user_id')
      .in('name', developers.value.map((name: string) => name.split(' ')[0]))
      .in('surname', developers.value.map((name: string) => name.split(' ')[1]));

    await supabase
      .from('project_role')
      .insert([
        { project_id: projectId, user_id: po.data?.user_id, role: 'product_owner' },
        { project_id: projectId, user_id: sm.data?.user_id, role: 'scrum_master' },
        ...devs.data?.map((item: { user_id: any }) => ({ project_id: projectId, user_id: item.user_id, role: 'developer' })) || []
      ]);

    if (error) {
      console.error("Error creating project role")
    } else {
      getProjects();
      isModalOpen.value = false;
    }
  }
}

async function updateProject() {
  updateForm.value.validate();
  const isFormValid = validateForm([selectedProject.value.name, selectedProject.value.productOwner, selectedProject.value.scrumMaster, selectedProject.value.developers]);
  if (!isFormValid) return;

  const { error } = await supabase
    .from('project')
    .update({name: selectedProject.value.name})
    .eq('id', selectedProject.value.id);

  if (error) {
    console.error("Error updating project")
  } else {
    await supabase
      .from('project_role')
      .delete()
      .eq('project_id', selectedProject.value.id);

    await supabase
      .from('project_role')
      .insert([
        { project_id: selectedProject.value.id, user_id: selectedProject.value.productOwner, role: 'product_owner' },
        // { project_id: selectedProject.value.id, user_id: selectedProject.value.scrumMaster, role: 'scrum_master' },
        // ...selectedProject.value.developers.map((id: number) => ({ project_id: selectedProject.value.id, user_id: id, role: 'developer' }))
      ]);
      getProjects();
      isEditModalOpen.value = false;
    }
}


const validateForm = (formItems: any[]) => {
  console.log(formItems)
  return formItems.every((item: any) => !!item);
}
</script>
