<template>
  <v-container fluid fill-height>
    <v-layout column align-center justify-center>
      <p class="text-center display-2 font-weight-black">{{question}}</p>
      <div class="d-flex flex-row justify-space-around">
        <v-flex xs12 sm10 md8>
          <div class="d-flex flex-row flex-wrap align-center justify-center">
            <div v-for="(game, index) of games" :key="index" class="mx-4 my-4">
              <game-card :game="game" @click="selectGame(game)" max-width="120px"></game-card>
            </div>
          </div>
          <v-divider />
          <pie :chartdata="datacollectionGames" />
        </v-flex>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import GameCard from "@/components/GameCard.vue";
import Pie from "@/components/Pie.vue";

import { PollResult } from "@/graphql/query.graphql";

export default {
  components: { GameCard, Pie },
  validate: context => /^\d+$/.test(context.params.id),
  async asyncData(context) {
    const id = parseInt(context.params.id);
    try {
      const result = await context.app.apolloProvider.defaultClient.query({
        query: PollResult,
        variables: {
          id
        }
      });
      const poll = result.data.Poll;
      const games = poll.options.map(option => {
        return {
          ...option.game,
          votes: option.votes,
          selected: false
        };
      });
      games.sort((a, b) => a.votes.length - b.votes.length);
      return {
        question: poll.question,
        games: games.reverse()
      };
    } catch (e) {
      return {
        question: "Something Unexpected Happened",
        games: []
      };
    }
  },
  computed: {
    totalVotes() {
      return this.games.reduce((old, game) => {
        return game.votes.length + old;
      }, 0);
    },
    datacollectionGames() {
      const data = [];
      const labels = [];
      let selectedVotes = 0;

      const games = this.games.filter(game => game.selected);
      games.forEach(game => {
        const gameVotes = game.votes.length;
        selectedVotes += gameVotes;
        data.push(gameVotes);
        labels.push(game.name);
      });

      const othersVotes = this.totalVotes - selectedVotes;
      if (othersVotes > 0) {
        data.push(othersVotes);
        labels.push("Others");
      }

      console.log(labels);

      return {
        datasets: [{ data }],
        labels
      };
    }
  },
  methods: {
    selectGame(game) {
      game.selected = !game.selected;
    }
  }
};
</script>
