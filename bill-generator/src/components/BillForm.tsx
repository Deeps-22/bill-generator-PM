import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import "../styles/BillForm.scss";
import BillPreview from "./BillPreview.tsx";

interface IBillFormValues {
  name: string;
  address: string;
  phone: string;
  eventDate: string;
  eventName: string;
  eventVenue: string;
  items: {
    description: string;
    amount: number;
  }[];
}

const BillForm = () => {
  const [preview, setPreview] = React.useState(false);

  const initialValues: IBillFormValues = {
    name: "",
    address: "",
    phone: "",
    eventDate: "",
    eventName: "",
    eventVenue: "",
    items: [{ description: "Camera", amount: 0 }],
  };

  const [formData, setFormData] = React.useState<IBillFormValues | null>(
    initialValues
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .required("Required"),
    eventDate: Yup.date().required("Required"),
    eventName: Yup.string().required("Required"),
    eventVenue: Yup.string().required("Required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          description: Yup.string().required("Required"),
          amount: Yup.number()
            .required("Required")
            .positive("Must be positive"),
        })
      )
      .min(1, "At least one item is required"),
  });

  const onSubmit = (values: IBillFormValues) => {
    console.log("Form data:", values);
    setFormData(values);
  };

  return (
    <div className="bill-form-container">
      <h2 className="form-title">Vistara Bill Generator</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values }) => (
          <Form className="form">
            {[
              { name: "name", label: "Name" },
              { name: "address", label: "Address" },
              { name: "phone", label: "Phone Number" },
              { name: "eventDate", label: "Event Date", type: "date" },
              { name: "eventName", label: "Event Name" },
              { name: "eventVenue", label: "Event Venue" },
            ].map(({ name, label, type = "text" }) => (
              <div key={name} className="form-group">
                <label htmlFor={name} className="label">
                  {label}
                </label>
                <Field
                  type={type}
                  name={name}
                  id={name}
                  className="input-field"
                />
                <ErrorMessage
                  name={name}
                  component="div"
                  className="error-message"
                />
              </div>
            ))}

            <FieldArray name="items">
              {({ push, remove }) => (
                <div className="items-array">
                  <h4>Items</h4>
                  {values.items.map((item, index) => (
                    <div key={index} className="item-group">
                      <div className="form-group">
                        <label>Description</label>
                        <Field
                          name={`items[${index}].description`}
                          className="input-field"
                          placeholder="Item description"
                        />
                        <ErrorMessage
                          name={`items[${index}].description`}
                          component="div"
                          className="error-message"
                        />
                      </div>
                      <div className="form-group">
                        <label>Amount</label>
                        <Field
                          name={`items[${index}].amount`}
                          type="number"
                          className="input-field"
                          placeholder="Amount"
                        />
                        <ErrorMessage
                          name={`items[${index}].amount`}
                          component="div"
                          className="error-message"
                        />
                      </div>
                      <div className="button-group">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="remove-button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-button"
                    onClick={() => push({ description: "", amount: 0 })}
                  >
                    Add Item
                  </button>
                </div>
              )}
            </FieldArray>

            <div className="button-group">
              <button type="submit" className="submit-button">
                Generate Bill
              </button>
              <button
                type="button"
                className="submit-button"
                disabled={formData === null}
                onClick={() => setPreview(!preview)}
              >
                Get Preview
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {preview && formData && <BillPreview values={formData} />}
    </div>
  );
};

export default BillForm;
