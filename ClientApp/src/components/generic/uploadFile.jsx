import React, { Component } from "react";

class UploadBase extends Component {
  fileName = "";
  fileType = "";

  readCsvFile = event => {
    // Check for the various File API support.
    if (window.FileReader) {
      // FileReader are supported.
      this.getAsText(event.target.files[0]);
    } else {
      alert("FileReader are not supported in this browser.");
    }
  };

  uploadFile = event => {
    if (window.FileReader) {
      // FileReader are supported.
      this.getAsByteArray(event.target.files[0]);
    } else {
      alert("FileReader are not supported in this browser.");
    }
  };

  getAsByteArray = fileToRead => {
    const reader = new FileReader();

    // console.log(fileToRead);
    this.fileName = fileToRead.name;
    this.fileType = fileToRead.type;
    // Read file into memory as UTF-8
    reader.readAsArrayBuffer(fileToRead);
    // Handle errors load
    reader.onload = this.loadHandler;
    reader.onerror = this.errorHandler;
  };

  getAsText = fileToRead => {
    const reader = new FileReader();

    // Read file into memory as UTF-8
    if (fileToRead) reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = this.loadHandlerCsv;
    reader.onerror = this.errorHandler;
  };

  loadHandler = event => {
    // console.log(event);

    var file = event.target.result;
    // console.log(file);
    //this method must be defined in child class
    this.getUploadedData(file, this.fileName, this.fileType);
  };

  loadHandlerCsv = event => {
    var csv = event.target.result;
    this.processData(csv);
  };

  processData = csv => {
    // console.log(csv);
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i = 0; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(";");
      var tarr = [];
      for (var j = 0; j < data.length; j++) {
        tarr.push(data[j]);
      }
      lines.push(tarr);
    }

    //this method must be defined in child class
    this.getDataFromCsvFile(lines);
  };

  errorHandler = evt => {
    if (evt.target.error.name == "NotReadableError") {
      alert("Cannot read file !");
    } else {
      alert("Unexpected upload error!");
    }
  };
}

export default UploadBase;
