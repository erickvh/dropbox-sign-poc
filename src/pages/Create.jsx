import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { TagsInput } from "react-tag-input-component";
import Sign from "../components/hello-sign.component";

export const CreatePage = () => {
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedCustomFields, setSelectedCustomFields] = useState([]);
  const [editUrl, setEditUrl] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.title.value);
    console.log(selectedRole);
    console.log(selectedCustomFields);

    const mergeFields = selectedCustomFields.map((customField) => {
      return {
        name: customField,
        type: "text",
      };
    });

    const signerRoles = selectedRole.map((role, index) => {
      return {
        name: role,
        order: index + 1,
      };
    });

    const data = {
      title: e.target.title.value,
      subject: e.target.title.value,
      message: e.target.title.value,
      signerRoles,
      ccRoles: [],
      mergeFields,
    };

    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/esignatures/dropbox/embeddedtemplate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then(async (response) => {
      const data = await response.json();
      setEditUrl(data.template.editUrl);
    });
  };

  return (
    <div>
      <Row className="justify-content-center my-4">
        <Col md={8}>
          <h3>Create template</h3>
          {/* <form onSubmit={handleSubmit}> */}
          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="form-group my-1">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="Enter title"
                // value={formData.title}
                // onChange={handleInputChange}
              />
            </div>

            {/* Roles Multiselect */}
            <div className="form-group my-1">
              <label htmlFor="roles">Select Roles:</label>
              <TagsInput
                value={selectedRole}
                onChange={setSelectedRole}
                name="roles"
                placeHolder="Select roles"
              />
            </div>

            {/* Custom Fields Input */}
            <div className="form-group my-1">
              <label htmlFor="customFields">Custom Fields:</label>
              <TagsInput
                value={selectedCustomFields}
                onChange={setSelectedCustomFields}
                name="roles"
                placeHolder="Select custom fields"
              />
            </div>

            {/* Submit Button */}
            <div className="form-group my-2">
              <button type="submit" className="btn btn-primary">
                Embedded URL
              </button>
            </div>
          </form>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>{editUrl && <Sign signingUrl={editUrl} />}</Col>
      </Row>
    </div>
  );
};
