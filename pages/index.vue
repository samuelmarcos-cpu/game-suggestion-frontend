<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm10 md8>
        <h1 class="text-center">GAME SUGGESTION</h1>
        <v-form ref="form" v-model="valid" class="my-5">
          <v-text-field
            clearable
            rounded
            filled
            dense
            placeholder="Type your question here"
            v-model="question"
            :rules="questionRules"
            :disabled="isLoadingCreate"
          ></v-text-field>
          <v-card>
            <v-card-title class="text-center justify-center py-3">RESTRICTIONS</v-card-title>
            <div class="d-flex flex-row flex-wrap mx-1 my-0">
              <v-chip
                close
                v-for="restriction in selected"
                :key="restriction.key"
                @click:close="selected.splice(selected.indexOf(restriction), 1)"
                class="ma-1"
              >{{restriction.name}}</v-chip>
            </div>
            <v-tabs :grow="true">
              <v-tab>Platforms</v-tab>
              <v-tab-item>
                <autocomplete v-model="selected" :search="search" placeholder="Select platform">
                  <template v-slot="{ item, toggle }">
                    <div class="ma-1">
                      <card
                        max-width="90px"
                        max-height="90px"
                        :name="item.name + ` (${item.active})`"
                        :image="item.image | imageValidation"
                        @click="toggle"
                      >
                        <transition name="slide">
                          <div v-if="item.active" class="text-center caption primary">ACTIVE</div>
                        </transition>
                      </card>
                    </div>
                  </template>
                </autocomplete>
              </v-tab-item>
            </v-tabs>
          </v-card>
          <v-btn
            rounded
            block
            class="mt-5"
            :disabled="!valid"
            :loading="isLoadingCreate"
          >Create Poll</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Autocomplete from "@/components/Autocomplete.vue";
import Card from "@/components/Card.vue";

import { SearchPlatforms } from "@/graphql/query.graphql";

export default {
  components: {
    Autocomplete,
    Card
  },
  data() {
    return {
      valid: true,
      question: "",
      selected: [],
      isLoadingCreate: false,

      questionRules: [
        v => !!v || "Question is required",
        v =>
          (v && v.trim().length >= 10) ||
          "Question must be bigger than 10 character"
      ]
    };
  },
  methods: {
    async search(q) {
      const result = await this.$apollo.query({
        query: SearchPlatforms,
        variables: {
          q
        }
      });
      return result.data.SearchPlatforms.map(platform => {
        return {
          key: platform.id,
          ...platform
        };
      });
    }
  }
};
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0px);
    opacity: 1;
  }
  to {
    transform: translateY(-20px);
    opacity: 0;
  }
}

.slide-enter-active {
  animation: slide-in 1s ease;
}

.slide-leave-active {
  animation: slide-out 1s ease;
}
</style>
