<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-space-around>
      <v-flex xs12 sm10 md8>
        <v-card class="pa-5">
          <v-form ref="form" v-model="valid">
            <v-text-field
              required
              label="Nickname"
              :rules="rules"
              :error-messages="msgError"
              v-model="user.nick"
              @keypress.enter="alterUser"
            ></v-text-field>
            <v-text-field
              required
              label="Password"
              type="password"
              :rules="rules"
              :error-messages="msgError"
              v-model="user.password"
              @keypress.enter="alterUser"
              class="mb-3"
            ></v-text-field>
            <v-btn block @click="alterUser">ALTER</v-btn>
          </v-form>
        </v-card>
        <v-card v-if="polls.length > 0" class="my-5 pa-5">
          <h1 class="text-center display-1 font-weight-black">My Polls</h1>
          <poll-card
            outlined
            v-for="poll of $options.filters.vottingCards(polls)"
            :key="poll.id"
            :id="poll.id"
            :question="poll.question"
            :date="poll.date"
            :restrictions="poll.restrictions"
            :votes="poll.votes"
          ></poll-card>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PollCard from "@/components/PollCard.vue";
import { mapGetters, mapActions } from "vuex";
import { MyPolls, AlterUser } from "@/graphql/user.graphql";

export default {
  components: { PollCard },
  middleware: ({ app, redirect }) => {
    const token = app.$apolloHelpers.getToken();
    if (token == null) {
      return redirect("/");
    }
  },
  async asyncData({ app }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: MyPolls
    });
    return { polls: data.MyPolls };
  },
  data() {
    const user = this.$store.getters.getUser || "";
    return {
      user: {
        nick: user.nick,
        password: ""
      },
      valid: false,
      rules: [v => (v && v.length > 0) || "Field must have characteres"],
      msgError: ""
    };
  },
  methods: {
    ...mapActions(["removeUser", "setUser"]),
    async alterUser() {
      this.$refs.form.validate();
      if (this.valid === false) return;

      try {
        const { data } = await this.$apollo.mutate({
          mutation: AlterUser,
          variables: this.user
        });
        const user = data.alterUser;
        this.setUser(user);
      } catch (e) {
        this.msgError = "Invalid nick/password";
      }
    }
  }
};
</script>
