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
  <v-dialog v-model="isTmpProjectViewOpen" style="max-width: 500px">
    <v-card>
      <v-card-title class="headline">Project</v-card-title>
      <v-card-actions>
        <v-btn class="bg-deep-purple" @click="showSprintCreate = true" style="margin: 0 0 20px 20px">Create new
          sprint</v-btn>
        <v-dialog v-model="showSprintCreate" class="dlgWindow" width="50%">
          <v-card title="New sprint">
            <v-card-text>
              <!-- Edit start date, end date and name -->
              <v-row dense>
                <!-- row to show errors when entering things -->
                <v-col cols="12">
                  <v-alert id="sprintError" v-if="showSprintError" type="error" elevation="2" colored>
                    Start and end date must be weekdays, and not in the past.
                    Start date must be before end date.
                  </v-alert>
                  <v-alert v-if="sprintOverlap">
                    Overlap with existing sprint, please change dates or name.
                  </v-alert>
                  <v-alert v-if="showSuccessMessage" type="success">
                    Sprint created successfully!
                  </v-alert>


                </v-col>
                <v-col cols="7">
                  <v-text-field v-model="sprintData.name" label="Name" required></v-text-field>
                </v-col>
                <v-divider></v-divider>

                <v-col cols="4">
                  <v-menu v-model="showDatePickerStart" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="sprintData.start_date" @click="showDatePickerStart = true" label="Start date"
                      prepend-icon="mdi-calendar" v-bind="attrs"
                        v-on="on"></v-text-field>

                    <v-date-picker v-model="sprintData.start_date" @input="showDatePickerStart = false"
                      v-if="showDatePickerStart" no-title>
                      <v-spacer></v-spacer>

                    </v-date-picker>
                  </template>
                  </v-menu>
                </v-col>
                <!-- <v-divider></v-divider> -->
                <v-col cols="4" >
                  <v-menu v-model="showDatePickerEnd" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="sprintData.end_date" @click="showDatePickerEnd = true" label="End date"
                    prepend-icon="mdi-calendar" v-bind="attrs"
                        v-on="on"></v-text-field>

                  <v-date-picker v-model="sprintData.end_date" v-if="showDatePickerEnd" no-title
                     ></v-date-picker>
                  </template>
                  </v-menu>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text="Close" variant="text" @click="showSprintCreate = false"></v-btn>
              <v-btn text="Save" variant="text" @click="saveSprint"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div v-if="isLoading">Loading...</div>
  <v-data-table v-else :headers="headers" :items="items" @click:row="openTmpProjectView"></v-data-table>
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
const isTmpProjectViewOpen = ref(false);
const isLoading = ref(true);
const items = ref<any[]>([]);

const selected_date = ref([]);
const showDatePicker = ref(false);

const currentProjectId = ref(0);

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

const openTmpProjectView = (click, item) => {
  console.log(item.item)
  currentProjectId.value = item.item.id;
  isTmpProjectViewOpen.value = true;
  console.log('currentProjectId', currentProjectId.value);
};

const minDate = new Date().toISOString().split('T')[0];
const showSprintError = ref(false);
const sprintOverlap = ref(false);
const showSuccessMessage = ref(false);

const validateWeekend = (date) => {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6; // 0 = Sunday, 6 = Saturday
};



// sprint values 
const sprintData = ref({
  name: '',
  start_date: ref([]),
  end_date: ref([]),
});
const showSprintCreate = ref(false);
const showDatePickerStart = ref(false);
const showDatePickerEnd = ref(false);

supabase.auth.onAuthStateChange(async (_, session) => {
  if (session) {
    const jwt = session.access_token;

    const payload = JSON.parse(atob(jwt.split('.')[1]));
    isAdmin.value = payload.user_role === 'admin';
  } else {
    console.log('The user is not authenticated');
  }
});

const validateSprintDates = () => {
  showSprintError.value = true;
  if (!validateWeekend(sprintData.value.start_date) || !validateWeekend(sprintData.value.end_date)) {
    showSprintError.value = true;
    return false;
  }
  if (sprintData.value.start_date > sprintData.value.end_date) {

    showSprintError.value = true;
    return false;
  }
  if (new Date(sprintData.value.start_date) < new Date(minDate) || new Date(sprintData.value.end_date) < new Date(minDate)) {
    showSprintError.value = true;
    return false;
  }
  showSprintError.value = false;
  return true;
};

async function validateSprint(sprintData) {
  const { data: projSprints, error: projSprErr } = await supabase
    .from('sprints')
    .select('*')
    .eq('project_id', currentProjectId.value);

  const sprintOverlap = projSprints.some(sprint => {
    const newStartDate = new Date(sprintData.value.start_date);
    const newEndDate = new Date(sprintData.value.end_date);
    const existingStartDate = new Date(sprint.start_date);
    const existingEndDate = new Date(sprint.end_date);

    const isOverlapping =
      (existingStartDate <= newStartDate && existingEndDate >= newStartDate) ||
      (existingStartDate <= newEndDate && existingEndDate >= newEndDate);

    const isNameDuplicate = sprint.name === sprintData.value.name;

    return isOverlapping || isNameDuplicate;
  });

  return sprintOverlap;
};

const resetFormAndCloseDialog = () => {
  sprintData.value = {
    name: '',
    startDate: ref([]),
    endDate: ref([])
  }; // Reset form data
  showSprintCreate.value = false; // Close dialog
};

async function saveSprint() {
  // make sure sprintdata isn't empty 
  if (sprintData.value.name === '' || sprintData.value.start_date.length === 0 || sprintData.value.end_date.length === 0) {
    // showSprintError.value = true;
    return;
  }

  if (!validateSprintDates()) return false;
  const isInvalid = await validateSprint(sprintData);
  if (isInvalid) {
    sprintOverlap.value = true;
    return;
  }
  sprintOverlap.value = false;

  var duration = countWeekdays(sprintData.value.start_date, sprintData.value.end_date) * 8 / 6;
  // round to int
  duration = Math.round(duration)

  // insert the new sprint into the database
  const { data, error } = await supabase
    .from('sprints')
    .insert([{
      name: sprintData.value.name,
      start_date: sprintData.value.start_date,
      end_date: sprintData.value.end_date,
      project_id: currentProjectId.value,
      duration: duration,
    }]);
  showSuccessMessage.value = true;
  setTimeout(() => {
    resetFormAndCloseDialog();
    showSuccessMessage.value = false;
  }, 3000);

  console.log(JSON.stringify(sprintData.value));

  

}

const countWeekdays = (startDate, endDate) => {
  // Parse the start and end dates from strings to Date objects
  let start = new Date(startDate);
  let end = new Date(endDate);

  // Counter for weekdays
  let count = 0;

  // Loop over each day from start to end
  while (start <= end) {
    // Get the day of the week, where 0 is Sunday and 6 is Saturday
    const dayOfWeek = start.getDay();

    // Check if the day is a weekday (Monday = 1 to Friday = 5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      count++;
    }

    // Move to the next day
    start.setDate(start.getDate() + 1);
  }

  return count;
}





async function getProjects() {
  const organizationId = localStorage.getItem('organizationId');
  console.log('organizationId', organizationId);
  const { data, error } = await supabase
    .from('project')
    .select('id, name, created_at, start_date, deadline')
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
