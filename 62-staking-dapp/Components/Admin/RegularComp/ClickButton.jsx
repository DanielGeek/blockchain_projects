import React from "react";

const ClickButton = ({ name, handleClick }) => {
  return (
    <div className="col-12">
      <button
        type="button"
        className="form__btn form__btn--small w-100"
        onClick={handleClick}
      >
        {name}
      </button>
    </div>
  );
};

export default ClickButton;
