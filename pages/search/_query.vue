<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md5>
        <template v-if="polls.length > 0">
          <poll-card
            v-for="poll in $options.filters.vottingCards(polls)"
            :key="poll.id"
            :id="poll.id"
            :question="poll.question"
            :date="poll.date"
            :restrictions="poll.restrictions"
            :votes="poll.votes"
          ></poll-card>
        </template>
        <div v-else class="text-center display-2 font-weight-black">No Result</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PollCard from "@/components/PollCard.vue";
import { SearchPoll } from "@/graphql/query.graphql";

export default {
  components: { PollCard },
  validate: context => /^\w+$|^\w[\w ]*\w$/.test(context.params.query),
  async asyncData({ params, app }) {
    const query = params.query;
    const { data } = await app.apolloProvider.defaultClient.query({
      query: SearchPoll,
      variables: { query }
    });
    return { polls: data.SearchPoll };
  }
};
</script>
