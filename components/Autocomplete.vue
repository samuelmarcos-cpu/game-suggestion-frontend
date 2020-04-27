<template>
  <div>
    <v-text-field
      clearable
      filled
      dense
      v-model="text"
      :placeholder="placeholder"
      :height="height"
      :loading="loading"
      :hint="hint"
      :persistent-hint="true"
      :disabled="disabled"
    ></v-text-field>
    <div class="d-flex flex-row flex-wrap align-center justify-center px-5 pb-5">
      <div v-for="(item, index) in itens" :key="item.key">
        <slot v-bind="{ item, toggle: factoryToggle(index) }"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: false
    },
    searchInterval: {
      type: Number,
      default: 500
    },
    search: Function,
    placeholder: String,
    height: Number,
    disabled: Boolean
  },
  data() {
    return {
      text: "",
      newText: "",
      hint: "",
      loading: false,
      itens: []
    };
  },
  methods: {
    factoryToggle(index) {
      return () => {
        const item = this.itens[index];
        item.active = !item.active;
      };
    }
  },
  watch: {
    async text(t) {
      this.newText = t;
      if (t.trim() == "") {
        this.hint = "";
        this.loading = false;
        return;
      }
      const request = await new Promise(resolve =>
        setTimeout(() => {
          if (t !== this.newText) {
            resolve(false);
          }
          resolve(true);
        }, this.searchInterval)
      );
      if (request === false) return;
      this.loading = true;
      let itens = await this.search(t);

      let selected = this.itens.filter(item => item.active);

      itens = itens.map(item => {
        let active = false;

        const index = selected.findIndex(sel => sel.key === item.key);
        if (index >= 0) {
          active = true;
          selected = selected.filter(sel => sel.key !== item.key);
        }

        return {
          ...item,
          active
        };
      });

      itens.push(...selected);

      if (t !== this.newText) {
        return;
      }
      this.itens = itens;
      this.$emit("result", this.itens);
      this.hint = this.itens.length === 0 ? "no results" : "";
      this.loading = false;
    },
    itens: {
      deep: true,
      handler(itens) {
        const selected = itens.filter(item => item.active);
        this.$emit("input", selected);
      }
    },
    value: {
      deep: true,
      handler(value) {
        this.itens.forEach(item => {
          const index = value.findIndex(vl => vl.key === item.key);
          item.active = index >= 0;
        });
      }
    }
  }
};
</script>
