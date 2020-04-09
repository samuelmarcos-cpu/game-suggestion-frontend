<script>
import { Pie } from "vue-chartjs";
export default {
  mixins: [Pie],
  props: ["chartdata", "options"],
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
  watch: {
    chartdata(newData, oldData) {
      this.renderChart(newData, this.options);
    }
  }
};
</script>
