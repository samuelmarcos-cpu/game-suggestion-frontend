<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-text-field
        filled
        rounded
        dense
        prepend-inner-icon="search"
        v-model="query"
        :hide-details="true"
        @keypress.enter="search($event.target.value)"
      ></v-text-field>
      <v-spacer />
      <v-dialog v-if="user == null" v-model="dialog" max-width="50%">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" class="mx-1">
            <v-icon left>{{ loginIcon }}</v-icon>Sign in
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Sign in</span>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-container>
              <v-row>
                <v-text-field
                  required
                  label="Nickname"
                  v-model="userLogin.nick"
                  :error-messages="msgError"
                  @keypress="msgError = ''"
                  @keypress.enter="login"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  required
                  label="Password"
                  type="password"
                  v-model="userLogin.password"
                  :error-messages="msgError"
                  @keypress="msgError = ''"
                  @keypress.enter="login"
                ></v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="d-flex flex-row justify-space-around">
            <v-btn text block color="blue darken-1" @click="login">Sign in</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div v-else>
        <v-btn text nuxt :to="`/user`" class="mx-1">{{user.nick.toUpperCase()}}</v-btn>
        <v-btn text @click="logout" class="mx-1">
          <v-icon left>{{ logoutIcon }}</v-icon>Log out
        </v-btn>
      </div>
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { Login } from "@/graphql/user.graphql";
import { mdiLogin, mdiLogout } from "@mdi/js";

export default {
  data() {
    return {
      title: "Game Suggestion",
      query: "",
      loginIcon: mdiLogin,
      logoutIcon: mdiLogout,
      dialog: false,
      msgError: "",
      userLogin: {},
      user: this.$cookies.get("cookie-user")
    };
  },
  methods: {
    search(search) {
      search = search.trim();
      if (search === "") return;
      this.query = search;
      this.$router.push({
        path: `/search/${this.query}`
      });
    },
    async login() {
      try {
        const { data } = await this.$apollo.query({
          query: Login,
          variables: this.userLogin
        });

        const user = data.Login;
        this.user = user;

        this.$cookies.set("cookie-user", user);
        this.$apolloHelpers.onLogin(user.token);

        this.userLogin = {};
        this.dialog = false;
      } catch (e) {
        this.msgError = "Invalid nick/password";
      }
    },
    logout() {
      this.user = null;
      this.$cookies.removeAll();
      this.$apolloHelpers.onLogout();
    }
  }
};
</script>
