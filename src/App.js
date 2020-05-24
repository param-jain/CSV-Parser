import React from 'react';
import './App.css';
import DataTable from './DataTable';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      headings: [],
      rows: [],
      currentPage: 1,
      maxItemsPerPage: 5,
      currentRows: []
    }
  }


  handleChange = (event) => {
    this.handleFiles(event.target.files);
  }

  handleFiles = files => {
    var reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = () => {
      this.processData(reader.result);
    }
}

processData = (csv)  => {
  var allTextLines = csv.split(/\r\n|\n/);
  var lines = [];
  for (var i=0; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(';');
          var tarr = [];
          for (var j=0; j<data.length; j++) {
              tarr.push(data[j]);
          }
          lines.push(tarr);
  }
  let tempRows = []
  for (var row=1; row<lines.length; row++) {
    tempRows[row-1] = this.parseRow(lines[row], 'r')
  }
  this.setState({
    headings: this.parseRow(lines[0], 'h'),
    rows: tempRows,
    currentRows: tempRows.slice((this.state.currentPage * this.state.maxItemsPerPage) - this.state.maxItemsPerPage, this.state.currentPage * this.state.maxItemsPerPage)
  });
}

parseRow = (row, identifier) => {
  var columns = [];
  var headings = [""];
  var allColumns = row[0].split(/,/);
  for (var i=0; i<allColumns.length; i++) {
    if (allColumns[i] != "") {
      if (identifier == 'r') {
        columns.push(allColumns[i]);
      } else {
        headings.push(allColumns[i]);
      }
    }
  } 

  if (identifier == 'r') {
    return columns;
  } else {
    return headings;
  }
}

changePage = (direction) => {
  if (direction == 'back') {
   this.setState({
    currentPage: this.state.currentPage - 1,
    currentRows: this.state.rows.slice(((this.state.currentPage - 1)* this.state.maxItemsPerPage) - this.state.maxItemsPerPage, (this.state.currentPage-1) * this.state.maxItemsPerPage)
   });
  } else if (direction == 'next') {
   this.setState({
    currentPage: this.state.currentPage + 1,
    currentRows: this.state.rows.slice(((this.state.currentPage + 1)* this.state.maxItemsPerPage) - this.state.maxItemsPerPage, (this.state.currentPage+1) * this.state.maxItemsPerPage)
   });
  }
  
}

paging = () => {
  return <div style={{marginTop: 10, marginLeft: 50}}>
   {this.state.currentPage > 1 ?
    <button style={{padding: 10, borderRadius: 10, margin: 15, marginRight: 5}} onClick={() => this.changePage('back')}>Previous</button>
   : null}
   {this.state.rows.length > this.state.currentPage * this.state.maxItemsPerPage ?
    <button style={{padding: 10, borderRadius: 10, margin: 15, marginLeft: 5}} onClick={() => this.changePage('next')}>Next</button>
   : null}
  </div>;
 }

  render() {
    return (
      <div className="App" style={{marginTop: 30}}>
        <div style={{marginLeft: -75, fontWeight: 'bold', fontSize: 30, marginBottom: 20}}>CSV PARSER</div>
        <input
        type="file"
        ref={(input) => { this.filesInput = input }}
        onChange={this.handleChange}
        />
        <div style={{marginTop: 15, marginLeft: 20, marginRight: 200}}>
          <DataTable headings={this.state.headings} rows={this.state.currentRows} />
          <div style={{flexDirection: 'row'}}>
            {this.paging()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
