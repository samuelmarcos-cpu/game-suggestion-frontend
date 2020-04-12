<template>
  <v-container fluid fill-height>
    <v-layout column align-center justify-center>
      <p class="text-center display-2 font-weight-black">{{question}}</p>
      <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-space-between">
          <div>Asked: {{date.toLocaleDateString()}}</div>
          <div>{{totalVotes}} Votes</div>
        </div>
        <game-group-result
          :games="games.filter(game => game.votes.length == highestVote).slice(0, 5)"
          :total-votes="totalVotes"
          :width-cards="170"
        />
        <game-group-result
          :games="games.filter(game => game.votes.length < highestVote)"
          :total-votes="totalVotes"
        />
        <div v-if="totalVotes > 0" class="d-flex flex-row justify-space-around my-5">
          <my-line :games="games.filter(game => game.selected)" precision="25" class="mx-5" />
          <pie :games="games.filter(game => game.selected)" :total-votes="totalVotes" class="mx-5" />
        </div>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import GameGroupResult from "@/components/GameGroupResult.vue";
import Pie from "@/components/charts/Pie.vue";
import MyLine from "@/components/charts/Line.vue";

import { PollResult } from "@/graphql/query.graphql";

export default {
  components: { GameGroupResult, Pie, MyLine },
  validate: context => /^\d+$/.test(context.params.id),
  async asyncData(context) {
    const id = parseInt(context.params.id);
    const result = await context.app.apolloProvider.defaultClient.query({
      query: PollResult,
      variables: {
        id
      }
    });

    const poll = result.data.Poll;
    let totalVotes = 0;
    let highestVote = 0;
    const games = poll.options.map((option, index) => {
      const qtdVotes = option.votes.length;
      totalVotes += qtdVotes;
      highestVote = highestVote < qtdVotes ? qtdVotes : highestVote;
      return {
        ...option.game,
        votes: option.votes,
        selected: index < 5
      };
    });

    return {
      question: poll.question,
      date: new Date(poll.date),
      games,
      highestVote,
      totalVotes
    };
  }
};
</script>
