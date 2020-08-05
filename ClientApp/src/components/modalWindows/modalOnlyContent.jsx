import React from "react";
import PropTypes from "prop-types";

class Modal extends React.Component {
  render() {
    return (
      <React.Fragment>
        <input
          className="modal-state"
          id={this.props.idButton}
          type="checkbox"
        />
        <div className="modal modal--pointerOff">
          <label className="modal__bg" htmlFor={this.props.idButton} />
          <div className="modal__inner">
            <label className="modal__close" htmlFor={this.props.idButton} />
            {this.props.children}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Modal.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;
