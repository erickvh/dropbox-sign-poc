import { useEffect, useState } from "react";
import { Badge, Button, Col, Row, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"; // Importing Bootstrap styles
import { NavLink } from "react-router-dom";
import Sign from "../components/hello-sign.component";
import {
  FaFileUpload,
  FaList,
  FaPenFancy,
  FaSign,
  FaTrash,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [editUrl, setEditUrl] = useState(null);

  const fetchTemplates = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/esignatures/listTemplates`
    );
    const data = await response.json();

    setTemplates(data);
  };
  useEffect(() => {
    fetchTemplates();
  }, []);

  const getEditEmbeddedUrl = async (id) => {
    const urlToGetEditEmbeddedUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/esignatures/dropbox/templates/${id}`;

    const response = await fetch(urlToGetEditEmbeddedUrl);
    const data = await response.json();

    const url = data.embedded.editUrl;

    return url;
  };

  const handleEditEmbededTemplate = async (templateId) => {
    console.log("templateId?", templateId);
    const url = await getEditEmbeddedUrl(templateId);
    setEditUrl(url);
  };

  const handleRemoveTemplate = (templateId) => async () => {
    const urlToRemoveTemplate = `${
      import.meta.env.VITE_BACKEND_URL
    }/esignatures/dropbox/templates/${templateId}`;

    if (!window.confirm("Are you sure you want to remove the template?"))
      return;

    try {
      await fetch(urlToRemoveTemplate, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Template removed");
      fetchTemplates();
    } catch (error) {
      toast.error("Error removing template");
    }
  };
  const handleReplaceDoc = async (templateId) => {
    const urlToReplaceDoc = `${
      import.meta.env.VITE_BACKEND_URL
    }/esignatures/dropbox/templates/${templateId}/replace-document`;

    if (!window.confirm("Are you sure you want to replace the document?"))
      return;

    try {
      const response = await fetch(urlToReplaceDoc, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      toast.success("Document replaced");
      console.log("data?", data);
    } catch (error) {
      toast.error("Error replacing document");
    }
  };
  return (
    <div>
      <Row className="justify-content-center align-content-center my-4">
        <Col md={8}>
          <h1>Templates</h1>
        </Col>
        <Col md={2}>
          <NavLink to="/create">
            <button className="btn btn-primary">Create template</button>
          </NavLink>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>id</th>
                <th>Name</th>
                <th> Roles </th>
                <th>Custom fields</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.templateId}>
                  <td>{template.templateId}</td>
                  <td>{template.title}</td>
                  <td>
                    {template.signerRoles.map((signer) => (
                      <Badge key={signer.name} bg="primary">
                        {signer.name}
                      </Badge>
                    ))}
                  </td>

                  <td>
                    {template.customFields.map((cf) => (
                      <Badge key={cf.name} bg="primary">
                        {cf.name}
                      </Badge>
                    ))}
                  </td>

                  <td>
                    <Button
                      className="me-2"
                      variant="primary"
                      onClick={() => {
                        handleEditEmbededTemplate(template.templateId);
                      }}
                    >
                      <FaPenFancy />
                    </Button>
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => {
                        handleReplaceDoc(template.templateId);
                      }}
                    >
                      <FaFileUpload />
                    </Button>
                    <NavLink to={`${template.templateId}/send-signature`}>
                      <Button className="me-2" variant="primary">
                        <FaList />
                      </Button>
                    </NavLink>

                    <Button
                      variant="danger"
                      className="me-2"
                      onClick={handleRemoveTemplate(template.templateId)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>{editUrl && <Sign signingUrl={editUrl} />}</Col>
      </Row>
      <ToastContainer />
    </div>
  );
};
