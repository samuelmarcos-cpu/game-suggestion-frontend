<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-space-around>
      <v-flex xs12 sm10 md8>
        <v-card class="pa-5">
          <v-text-field required label="Nickname" v-model="user.nick"></v-text-field>
          <v-text-field required label="Password" type="password"></v-text-field>
          <v-row class="justify-space-around">
            <v-btn>DELETE</v-btn>
            <v-btn>ALTER</v-btn>
          </v-row>
        </v-card>
        <!-- <h1 class="text-center display-3 font-weight-black mt-5">My Polls</h1> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  asyncData({ app }) {
    const user = app.$cookies.get("cookie-user");
    return { user };
  }
};
</script>
