<template>
    <v-dialog v-model="show" class="dlgWindow" width="50%">
      <v-card>
        <template v-slot:text>
          <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          ></v-text-field>
        </template>
        <v-data-table density="compact" :headers="headers" :items="users" :search="search" @click:row="editUser">
        </v-data-table>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Close"
            variant="text"
            @click="show = false"
          ></v-btn>
          <v-btn @click="$refs.dlgEditUser.edit = true; $refs.dlgEditUser.show = true;" class="dlgButton">Uredi uporabnike</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    <dlg-new-user ref="dlgEditUser"></dlg-new-user>
  </template>
  <script>
  // import { mdiAccount } from "@mdi/js";
  import DlgNewUser from '../dialogs/DlgNewUser.vue';

  export default {
    components: {
      DlgNewUser
    },
    data() {
      return {
        show: false,
        search: '',
        headers: [
          {
            align: 'start',
            key: 'user',
            sortable: false,
            title: 'Uporabnik'
          },
          {
            key: 'email',
            title: 'E-mail'
          }
        ],
        users: [
          {
            user: 'Janez',
            email: 'Janez@Novak.si'
          },
          {
            user: 'Jana',
            email: 'Jana@Horvat.com'
          },
        ]
      }
    },
    methods: {
      editUser(click, item) {
        console.log(item.item);
        this.$refs.dlgEditUser.dlgData = item.item;
        this.$refs.dlgEditUser.show = true;
      }
    },
  };
  </script>
  