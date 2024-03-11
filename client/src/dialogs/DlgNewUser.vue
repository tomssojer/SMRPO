<template>
    <v-dialog v-model="show" class="dlgWindow" width="50%">
      <v-card title="Nov uporabnik">
        <v-card-text>
          <v-row dense>
            <v-text-field
              v-model="dlgData.user"
              label="Uporabniško ime"
              required
            ></v-text-field>
          </v-row>
          <v-row dense>
            <v-text-field
              v-model="dlgData.password"
              label="Geslo"
              type="password"
              required
            ></v-text-field>
          </v-row>
          <v-row dense>
            <v-text-field
              v-model="dlgData.fname"
              label="Ime"
              required
            ></v-text-field>
          </v-row>
          <v-row dense>
            <v-text-field
              v-model="dlgData.lname"
              label="Priimek"
              required
            ></v-text-field>
          </v-row>
          <v-row dense>
            <v-text-field
              v-model="dlgData.email"
              label="E-mail"
              required
            ></v-text-field>
          </v-row>
          <v-row>
            <v-radio-group v-model="dlgData.rights" inline label="Sistemske pravice:" :disabled="false">
              <v-radio label="Administrator" value="admin"></v-radio>
              <v-radio label="Uporabnik" value="user"></v-radio>
            </v-radio-group>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Close"
            variant="text"
            @click="show = false"
          ></v-btn>
          <v-btn
            text="Save"
            variant="text"
            @click="saveNewUser"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>


<script>
export default {
  data() {
    return {
      show: false,
      edit: false,
      dlgData: {
        user: '',
        password: '',
        fname: '',
        lname: '',
        email: '',
        rights: 'user'
      }
    }
  },
  methods: {
    saveNewUser() {
      if(this.edit) //ali se ustvarja/spreminja uporabnik
        console.log("edit");
      console.log(JSON.stringify(this.dlgData));
    }
  },
};
</script>
