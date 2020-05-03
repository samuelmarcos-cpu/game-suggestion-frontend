<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-btn text nuxt to="/">{{ title }}</v-btn>
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
            <v-icon left>{{ userIcon }}</v-icon>User
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">User</span>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-form v-model="valid">
              <v-text-field
                required
                label="Nickname"
                v-model="userLogin.nick"
                :rules="textEmpty"
                :error-messages="msgError"
                :disabled="isLoading"
                @keypress="msgError = ''"
                @keypress.enter="login"
              ></v-text-field>
              <v-text-field
                required
                label="Password"
                type="password"
                v-model="userLogin.password"
                :rules="textEmpty"
                :error-messages="msgError"
                :disabled="isLoading"
                @keypress="msgError = ''"
                @keypress.enter="login"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex flex-row justify-space-around">
            <v-btn
              text
              color="blue darken-1"
              :loading="isLoading"
              :disabled="valid === false"
              @click="login"
            >
              <v-icon left>{{ newUserIcon }}</v-icon>Log in |
              <v-icon left>{{ loginIcon }}</v-icon>Sign up
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div v-else>
        <v-btn text nuxt :to="`/user`" class="mx-1">{{ user ? user.nick.toUpperCase() : "" }}</v-btn>
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
import { mapGetters, mapActions } from "vuex";
import { NewUser, Login } from "@/graphql/user.graphql";
import { mdiAccount, mdiLogin, mdiAccountPlus, mdiLogout } from "@mdi/js";

export default {
  ...mapActions({ created: "setUserCookie" }),
  data() {
    return {
      title: "Game Suggestion",
      query: "",
      userIcon: mdiAccount,
      loginIcon: mdiLogin,
      newUserIcon: mdiAccountPlus,
      logoutIcon: mdiLogout,
      isLoading: false,
      dialog: false,
      valid: false,
      textEmpty: [v => (v && v.length > 0) || "This field is required"],
      msgError: "",
      userLogin: {}
    };
  },
  computed: mapGetters({ user: "getUser" }),
  methods: {
    ...mapActions({
      setUser: "setUser",
      removeUser: "removeUser"
    }),
    search(search) {
      search = search.trim();
      if (search === "") return;
      this.query = search;
      this.$router.push({
        path: `/search/${this.query}`
      });
    },
    async newUser() {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: NewUser,
          variables: this.userLogin
        });

        const user = data.newUser;
        this.setUser(user);

        this.userLogin = {};
        this.dialog = false;
      } catch (e) {
        this.msgError = "Invalid nick/password";
      }
    },
    async login() {
      this.isLoading = true;
      try {
        const { data } = await this.$apollo.query({
          query: Login,
          variables: this.userLogin
        });

        const user = data.Login;
        this.setUser(user);

        this.userLogin = {};
        this.dialog = false;
      } catch (e) {
        await this.newUser();
      }
      this.isLoading = false;
    },
    logout() {
      this.removeUser();
      const path = this.$route.path;
      if (path === "/user") {
        this.$router.push({ path: "/" });
      }
    }
  }
};
</script>
