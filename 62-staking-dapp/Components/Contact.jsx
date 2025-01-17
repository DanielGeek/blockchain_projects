import React from "react";
import { useForm, ValidationError } from "@formspree/react";
import toast from "react-hot-toast";

import { IoMdClose } from "./ReactICON";

const FORMSPREE_API = process.env.NEXT_PUBLIC_FORMSPREE_API;

const Contact = ({ setContactUs }) => {
  const notifySucess = (msg) => toast.success(msg, { duration: 2000 });

  const [state, handleSubmit] = useForm(FORMSPREE_API);

  if (state.succeeded) {
    return notifySucess("Message sent successfully");
  }

  return (
    <div
      className="modal modal--auto show"
      id="modal-ask"
      tabIndex={-1}
      aria-labelledby="modal-ask"
      aria-modal="true"
      role="dialog"
      style={{
        display: "block",
        paddingLeft: 0,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal__content">
            <button
              className="modal__close"
              onClick={() => setContactUs(false)}
            >
              <i className="ti ti-x">
                <IoMdClose />
              </i>
            </button>
            <h4 className="modal__title">Ask a questions</h4>
            <p className="modal__text">
              Welcome to Crypto King, stake your.
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>

            <form
              onSubmit={handleSubmit}
              className="modal__form"
            >
              <div className="form__group">
                <input
                  className="form__input"
                  type="name"
                  name="name"
                  id="name"
                  placeholder="Name"
                />
                <ValidationError
                  prefix="Name"
                  field="name"
                  error={state.errors}
                />
              </div>
              <div className="form__group">
                <input
                  className="form__input"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  error={state.errors}
                />
              </div>
              <div className="form__group">
                <textarea
                  className="form__textarea"
                  type="message"
                  name="message"
                  id="message"
                  placeholder="Your questions"
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  error={state.errors}
                />
              </div>
              <button
                type="submit"
                className="form__btn"
                disabled={state.submitting}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
