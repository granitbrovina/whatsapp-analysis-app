import Plotly from 'plotly.js/lib/core';

// Manually import only the chart types we need
import scatter from 'plotly.js/lib/scatter';
import heatmap from 'plotly.js/lib/heatmap';
import bar from 'plotly.js/lib/bar';
import pie from 'plotly.js/lib/pie';

// Register the chart types
Plotly.register([
  scatter,
  heatmap,
  bar,
  pie,
]);

export default Plotly;