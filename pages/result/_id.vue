<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm10 md8>
        <poll-title :title="question" :asked="date" :votes="totalVotes">
          <div class="d-flex flex-row justify-space-around my-1">
            <v-btn text>
              <v-icon left>{{ share }}</v-icon>Share
            </v-btn>
            <v-btn text nuxt :to="`/vote/${poll}`" class="mx-1">
              <v-icon left>{{ check }}</v-icon>Vote
            </v-btn>
          </div>
        </poll-title>

        <game-group-result
          :games="games.filter(game => game.votes.length == this.highestVote)"
          :total-votes="totalVotes"
          :width-cards="170"
        />

        <div v-if="totalVotes > 0" class="d-flex flex-row justify-space-around my-5">
          <my-line :games="games.filter(game => game.selected)" :precision="25" class="mx-5" />
          <pie :games="games.filter(game => game.selected)" :total-votes="totalVotes" class="mx-5" />
        </div>

        <game-group-result
          :games="games.filter(game => game.votes.length < this.highestVote)"
          :total-votes="totalVotes"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PollTitle from "@/components/PollTitle.vue";
import GameGroupResult from "@/components/GameGroupResult.vue";
import MyLine from "@/components/charts/Line.vue";
import Pie from "@/components/charts/Pie.vue";

import { PollResult } from "@/graphql/query.graphql";

import { mdiCheckBoxOutline, mdiShareVariant } from "@mdi/js";

export default {
  components: { PollTitle, GameGroupResult, MyLine, Pie },
  validate: context => /^\d+$/.test(context.params.id),
  async asyncData({ params, app }) {
    const id = parseInt(params.id);
    const { data } = await app.apolloProvider.defaultClient.query({
      query: PollResult,
      variables: { poll: id }
    });
    const poll = data.Poll;
    let totalVotes = poll.votes.length;
    let highestVote = 0;
    const games = [];

    if (totalVotes > 0) {
      poll.votes.forEach(vote => {
        let findGame = false;
        games.forEach(game => {
          if (game.id === vote.game.id) {
            findGame = true;
            game.votes.push({ date: vote.date });
          }
        });
        if (findGame === false) {
          games.push({
            ...vote.game,
            votes: [{ date: vote.date }],
            selected: false
          });
        }
      });
      games.sort((a, b) => a.votes.length - b.votes.length);
      games.reverse();
      highestVote = games[0].votes.length;
      games.forEach((game, index) => {
        game.selected = index < 5;
      });
    }

    return {
      poll: id,
      question: poll.question,
      date: new Date(poll.date),
      games,
      highestVote,
      totalVotes
    };
  },
  data() {
    return {
      check: mdiCheckBoxOutline,
      share: mdiShareVariant
    };
  }
};
</script>
