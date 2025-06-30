'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// A placeholder component to show while the heavy Plotly component is loading.
function PlotlySkeleton() {
  return <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>;
}

// Dynamically import the Plotly component using the correct factory pattern.
// This ensures it only loads on the client-side and is properly bundled.
const DynamicPlot = dynamic(
  () => {
    // These require() statements run only in the browser, not on the server.
    const createPlotlyComponent = require('react-plotly.js/factory').default;
    const Plotly = require('@/lib/plotly').default;
    // The factory function creates the component we need.
    return Promise.resolve(createPlotlyComponent(Plotly));
  },
  {
    ssr: false, // Ensure it never runs on the server
    loading: () => <PlotlySkeleton />, // Show the skeleton while loading
  }
);

// This is the main component we use in our Dashboard.
export default function Plot({ data }) {
  // If data hasn't loaded yet, show the skeleton.
  if (!data) {
    return <PlotlySkeleton />;
  }
  
  try {
    const plotData = JSON.parse(data);
    // Enhance the layout for better responsiveness.
    const layout = { ...plotData.layout, autosize: true };
    
    return (
      <DynamicPlot
        data={plotData.data}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', minHeight: '400px' }} // Set a min-height for consistency
        config={{ responsive: true }}
      />
    );
  } catch (error) {
    console.error("Failed to parse plot data:", error);
    return <div className="text-red-500 p-4">Error: Could not render chart.</div>;
  }
}