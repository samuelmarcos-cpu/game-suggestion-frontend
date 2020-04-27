<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md5>
        <template v-if="polls.length > 0">
          <v-card nuxt v-for="poll in polls" :key="poll.id" :to="`/vote/${poll.id}`" class="my-5">
            <v-card-title>{{ poll.question }}</v-card-title>
            <v-card-subtitle>Asked: {{ poll.date.toLocaleDateString() }}</v-card-subtitle>
            <v-card-text>
              <div class="d-flex flex-row justify-space-between">
                <div>Restrictions: {{poll.restrictions}}</div>
                <div>Votes: {{poll.votes}}</div>
              </div>
            </v-card-text>
          </v-card>
        </template>
        <div v-else class="text-center display-2 font-weight-black">No Result</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { SearchPoll } from "@/graphql/query.graphql";

export default {
  validate: context => /^\w+$|^\w[\w ]*\w$/.test(context.params.query),
  async asyncData(context) {
    const query = context.params.query;
    const result = await context.app.apolloProvider.defaultClient.query({
      query: SearchPoll,
      variables: { query }
    });
    const searchPoll = result.data.SearchPoll;
    const polls = searchPoll.map(poll => {
      const platforms = poll.platforms.length;
      const genres = poll.genres.length;
      return {
        id: poll.id,
        question: poll.question,
        date: new Date(poll.date),
        restrictions: platforms + genres,
        votes: poll.votes.length
      };
    });
    return { polls };
  }
};
</script>
