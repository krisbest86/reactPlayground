import React, { Component } from "react";
import Joi from "joi";
import Input from "./input";
import Select from "./select";
import Datalist from "./datalist";
import Button from "./button";
import Text from "./textComponent";
import UploadSimpleDialog from "../uploadComponents/uploadSimpleDialog";
import CheckBox from "./checkBox";
import _ from "lodash";

class Form extends Component {
  state = {
    data: {},
    dataDatalistInputs: {},
    errors: {}
  };

  renderForm = children => {
    return <form onSubmit={this.handleSubmit}>{children}</form>;
  };
  handleSubmit = e => {
    //prevent defualt behaviour of submit button, which is sending request to the server
    e.preventDefault();
    //if clicked means validation passed because in other case button would not be visible
    // const errors = this.validate();
    // this.setState({ errors });
    //submit wywoluje metoda w klasach dziedziczacych
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    // console.log(input);
    const data = { ...this.state.data };
    const dataDatalistInputs = { ...this.state.dataDatalistInputs };
    const errors = { ...this.state.errors };
    //validate input
    if (this.validateInput(input)) {
      const error = this.validateChange(input);
      if (error) errors[input.name] = error;
      else delete errors[input.name];
    }

    // console.log(data);
    // console.log(input);
    // console.log(dataDatalistInputs);
    // console.log(input.name && dataDatalistInputs[input.name]);

    let isUpdated;
    if (input.name && dataDatalistInputs.hasOwnProperty(input.name)) {
      // console.log("true");
      dataDatalistInputs[input.name] = input.value;
      isUpdated = dataDatalistInputs[input.name] === input.value;
      this.setState({ dataDatalistInputs, errors, isUpdated });
    } else {
      data[input.name] = input.value;
      isUpdated = data[input.name] === input.value;
      this.setState({ data, errors, isUpdated });
    }
  };

  handleFileUploaded = (name, file, filename, fileType) => {
    const { data } = this.state;

    // console.log(filename);
    const fileData = { data: file, filename: filename, fileType: fileType };
    data[name] = fileData;

    this.setState({ data });
  };
  validate = () => {
    const errors = {};

    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);

    // console.log(`validate() ${error}`);

    if (!error) return null;

    error.details.map(item => (errors[item.path[0]] = item.message));

    return errors;
  };

  validateChange = input => {
    const { name, value } = input;
    // console.log(value);
    // console.log(name);
    // console.log(this.schema);

    // console.log(this.schema);
    const { error } = Joi.validate(
      { [name]: value }, //nazwa propeprty -[name] i wartosc - value
      { [name]: this.schema[name] } //nazwa propeprty -[name] i wartosc this.schema[name]
    );

    return error ? error.details[0].message : null;
  };

  validateInput = input => {
    if (input.tagName === "LABEL") return false;

    return true;
  };

  renderCell = (name, property, parentkey) => {
    if (property.enums)
      return this.renderSelect(name, parentkey, property.enums);
    if (property.type === "Array") return this.renderDatalist(name, parentkey);
    if (property.type === "ObjectId")
      return this.renderSelect(name, parentkey, property.referencedValues);
    if (property.type === "file") return this.renderUploadDialog(name);

    return this.renderInput(
      name,
      null,
      property.type === "Number" ? "number" : "text"
    );
  };

  renderButton = (name, classes, onClick) => {
    return (
      <Button
        name={name}
        disabled={this.validate()}
        className={"btn " + (classes || "")}
        onClick={onClick}
      />
    );
  };

  renderCheckBox = (handleChange, value, labels) => {
    return (
      <CheckBox
        checked={value}
        labels={labels}
        handleChange={handleChange}
      ></CheckBox>
    );
  };

  renderInput = (name, title, type, placeholder, classes, flags) => {
    const { data } = this.state;

    return (
      <Input
        name={name}
        title={title}
        type={type}
        placeholder={placeholder}
        onChange={this.handleChange}
        value={data[name]}
        classes={classes}
        error={this.state.errors[name]}
        flags={flags}
      />
    );
  };

  renderSelect = (name, keyParent, options) => {
    const { data } = this.state;

    // console.log(options);
    return (
      <Select
        name={name}
        title={name}
        keyParent={keyParent}
        onChange={this.handleChange}
        value={data[name]}
        options={options}
        error={this.state.errors[name]}
      />
    );
  };

  renderUploadDialog = name => {
    const { data } = this.state;

    // console.log(name);
    return (
      <React.Fragment>
        {data[name] && !data[name].filename && (
          <React.Fragment>
            <Text>{data[name] + "  "}</Text>
            <Button
              name="Download"
              onClick={() => this.props.downloadFile(data[name])}
            />
          </React.Fragment>
        )}
        <Text>{data[name].filename}</Text>
        {!data[name] && (
          <UploadSimpleDialog
            name={name}
            handleFileUploaded={this.handleFileUploaded}
          />
        )}
        {data[name] && <Button name="reset" onClick={this.reset} />}
      </React.Fragment>
    );
  };

  renderDatalist = (key, parentkey) => {
    const { data, dataDatalistInputs } = this.state;
    // console.log(data);
    // console.log(dataDatalistInputs);
    // console.log(data[key]);

    return (
      <Datalist
        name={key}
        parentkey={parentkey}
        title={key}
        onChange={this.handleChange}
        addElement={this.addDataListElement}
        deleteElement={this.deleteDataListElement}
        onSelectedFormDataList={this.onSelectedFormDataList}
        value={dataDatalistInputs[key]}
        options={data[key]}
        error={this.state.errors[key]}
      />
    );
  };

  onSelectedFormDataList = (name, value) => {
    const { dataDatalistInputs, errors } = this.state;

    dataDatalistInputs[name] = value;
    delete errors[name];

    this.setState({ dataDatalistInputs, errors });
  };

  reset = () => {
    const { data } = this.state;

    console.log(data);

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = "";
      }
    }

    this.setState({ data });
  };

  addDataListElement = (name, value) => {
    const { data, dataDatalistInputs } = this.state;

    // console.log(data);
    // console.log(dataDatalistInputs);

    if (!data[name]) data[name] = [];

    data[name].push(value);
    dataDatalistInputs[name] = "";
    alert("added");
    this.setState({ data, dataDatalistInputs });
  };

  deleteDataListElement = (name, value) => {
    const { data, dataDatalistInputs } = this.state;

    data[name].splice(data[name].indexOf(value), 1);
    dataDatalistInputs[name] = "";

    alert("deleted");
    this.setState({ data, dataDatalistInputs });
  };

  setValidationTableEntitySchema = props => {
    // console.log(props);
    const schema = Object.keys(props.columnsDefinition).reduce(
      (object, column) => {
        let baseJoi = Joi;
        const element = this.props.columnsDefinition[column];
        //  console.log(baseJoi);

        if (element.validators) {
          object[column] = element.validators.reduce(
            (result, currentValidator) => {
              return this.addJoiValidator(currentValidator, result);
            },
            Joi
          );
        } else {
          let joiString = baseJoi.string().allow("");
          object[column] = joiString;
        }

        // console.log(object);
        return object;
      },
      {}
    );

    // console.log(schema);
    return schema;
  };

  addJoiValidator = (validator, joiObject) => {
    // return joiObject.string().regex(/^[0-9](-[0-9])*$/);

    // console.log(validator);
    if (validator.name === "regex") {
      // console.log(validator.value);
      const regex = new RegExp(validator.value);
      return joiObject
        .string()
        .allow("")
        .regex(regex)
        .error(errors => {
          return {
            message: validator.message
          };
        });
    } else if (validator.name === "StringRequired") {
      return joiObject.string();
    } else if (validator.name === "Number") {
      return joiObject.number();
    }
  };

  toggleFlag = (flag, key, value) => {
    const { data } = this.state;

    if (!key) {
      data[flag] = !data[flag];
    } else {
      for (const row of data) {
        if (row[key] === value) row[flag] = !row[flag];
      }
    }

    this.setState({ data });
  };
}

export default Form;
