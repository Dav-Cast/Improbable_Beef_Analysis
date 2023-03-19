function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var desired_sample = samples.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var desired_metadata = data.metadata.filter(sampleObj => sampleObj.id == sample);
 
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var first_sample = desired_sample[0];

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var first_sample_metadata = desired_metadata[0];    

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuids = first_sample.otu_ids;
    var otulabels = first_sample.otu_labels;
    var samplevalues = first_sample.sample_values;

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wash_freq = first_sample_metadata.wfreq;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuids.slice(0,10).map(otuID => `OTU: ${otuID}`).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      x: samplevalues.slice(0,10).reverse(),
      y: yticks,
      orientation: 'h',
      text: otulabels.slice(0,10).reverse(),
      marker: {
        color: samplevalues.slice(0,10).reverse(),
        colorscale: 'Reds'
      }     
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterias Found",
      margin: {
        t: 30, l: Math.max(samplevalues)
      }
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuids,
      y: samplevalues,
      text: otulabels,
      mode: 'markers',
      marker: {
        color: otuids,
        size: samplevalues,
        colorscale: 'Reds'
      }
    }];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubblelayout = {
      title: 'Bacteria Cultures Per Sample',
      hovermode:'closest',
      xaxis: {title: "OTU ID"},
      margin: {t:50}
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubblelayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: 'indicator',
      mode: 'gauge+number',
      value: wash_freq,
      title: {text: "<b>Bellybutton Washing Frequency</b> <br>Scrubs per Week", font: { size: 24 } },
      gauge: {
        axis: {range: [null, 10], tickcolor: 'black', tickwidth: 3},
        bar: {color: 'white'},
        bgcolor: 'white',
        borderwidth: 4,
        bordercolor: "black",
        steps: [
          { range: [0, 2], color: "lightcoral" },
          { range: [2, 4], color: "indianred" },
          { range: [4, 6], color: "brown" },
          { range: [6, 8], color: "firebrick" },
          { range: [8, 10], color: "maroon" }
        ],
      }
    }];
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: { t: 20, b: 20, l: 20, r: 30, }

    };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
