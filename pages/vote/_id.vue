<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm10 md8>
        <poll-title :title="question" :asked="date">
          <div class="d-flex flex-row justify-space-around">
            <v-btn text>
              <v-icon left>{{ share }}</v-icon>Share
            </v-btn>
            <v-btn text nuxt :to="`/result/${poll}`">
              <v-icon left>{{ pollIcon }}</v-icon>Result
            </v-btn>
          </div>
        </poll-title>

        <div v-if="restrictions.length > 0" class="d-flex justify-center">
          <v-card class="px-5 py-1 mb-3">
            <div class="title text-center">RESTRICTIONS</div>
            <div class="d-flex flex-row flex-wrap align-center justify-center py-1">
              <v-chip
                v-for="restriction in restrictions"
                :key="restriction.id"
                class="ma-1"
              >{{restriction.name}}</v-chip>
            </div>
          </v-card>
        </div>

        <autocomplete
          placeholder="Search the game"
          :search="searchGames"
          :height="50"
          :disabled="isLoadingVote"
          @result="games = $event"
        >
          <template v-slot="{ item, toggle }">
            <div class="ma-1">
              <card
                max-width="132px"
                max-height="187px"
                :name="item.name"
                :image="item.image | imageValidation | imageCoverBig"
                :loading="item.active"
                :disabled="isLoadingVote"
                @click="vote(toggle, item.id)"
              >
                <v-container fluid fill-height class="pa-0 align-end">
                  <div class="d-flex flex-row align-end px-2 py-1 font-weight-black">{{item.year}}</div>
                </v-container>
              </card>
            </div>
          </template>
        </autocomplete>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PollTitle from "@/components/PollTitle.vue";
import Autocomplete from "@/components/Autocomplete.vue";
import Card from "@/components/Card.vue";

import { PollVote, SearchGames } from "@/graphql/query.graphql";
import { Vote } from "@/graphql/mutation.graphql";

import { mdiPoll, mdiShareVariant } from "@mdi/js";

export default {
  components: { PollTitle, Autocomplete, Card },
  validate: context => /^\d+$/.test(context.params.id),
  async asyncData(context) {
    const id = parseInt(context.params.id);
    const resPoll = await context.app.apolloProvider.defaultClient.query({
      query: PollVote,
      variables: { poll: id }
    });
    const poll = resPoll.data.Poll;
    return {
      poll: id,
      question: poll.question,
      date: new Date(poll.date),
      restrictions: [...poll.platforms, ...poll.genres]
    };
  },
  data() {
    return {
      games: null,
      isLoadingVote: false,
      pollIcon: mdiPoll,
      share: mdiShareVariant
    };
  },
  methods: {
    async searchGames(query) {
      const result = await this.$apollo.query({
        query: SearchGames,
        variables: { poll: this.poll, query }
      });
      return result.data.SearchGames.map(game => {
        return {
          key: game.id,
          ...game
        };
      });
    },
    async vote(toggle, game) {
      toggle();
      this.isLoadingVote = true;
      const id = this.$route.params.id;
      await this.$apollo.mutate({
        mutation: Vote,
        variables: { poll: parseInt(id), game }
      });
      this.$router.push({
        path: `/result/${id}`
      });
      this.isLoadingVote = false;
    }
  }
};
</script>
