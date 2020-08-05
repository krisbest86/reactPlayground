import React from "react";
import UploadBase from "../generic/uploadFile";

class UploadSimpleDialog extends UploadBase {
  state = {};
  render() {
    const { accept, isReadCsv, name, ...rest } = this.props;

    return (
      <div>
        <input
          name={name}
          type="file"
          id="csvFileInput"
          onChange={
            isReadCsv ? this.readCsvFile.bind(this) : this.uploadFile.bind(this)
          }
          accept={accept}
        />
      </div>
    );
  }

  getDataFromCsvFile = async data => {
    // console.log(data);
    const { post } = this.props;
    const players = [];
    for (let index = 1; index < data.length; index++) {
      const element = data[index];
      if (element.length > 0 && element[0]) {
        let entity = { ...this.props.commonProps };

        for (let index = 0; index < element.length; index++) {
          const value = element[index];
          entity[data[0][index]] = value.trim();
        }
        players.push(entity);
      }
    }
    // console.log(entity);
    if (players.length > 0) await post(players);
  };

  getUploadedData = (data, filename, fileType) => {
    // console.log(data);
    this.props.handleFileUploaded(this.props.name, data, filename, fileType);
  };
}

export default UploadSimpleDialog;
