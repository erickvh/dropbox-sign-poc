import { useEffect, useState } from "react";
import { Badge, Button, Col, Row, Table } from "react-bootstrap";

// import Sign from "../components/hello-sign.component";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sign from "../components/hello-sign.component";
import DownloadButton from "../components/download-button";
import { FaFileSignature } from "react-icons/fa";

export const SendSignaturePage = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);

  const [teamMembers, setTeamMembers] = useState([]);
  const [customFieldValues, setCustomFieldValues] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [signatureRequests, setSignatureRequests] = useState([]);
  const [signingUrl, setSigningUrl] = useState(null);

  const fetchTemplates = async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/esignatures/dropbox/templates/${id}/view`
    );
    const data = await response.json();

    setTemplate(data);
  };

  const fetchSigners = async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/esignatures/dropbox/templates/${id}/signatures`
    );
    const data = await response.json();

    setSignatureRequests(data);
  };

  const getTeambers = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/esignatures/team-members`
    );
    const data = await response.json();

    setTeamMembers(data);
  };

  useEffect(() => {
    fetchTemplates();
    getTeambers();
    fetchSigners();
  }, []);

  const handleSelectChange = (e, index) => {
    const selectedId = e.target.value;

    const newSelectedMembers = [...selectedMembers];
    newSelectedMembers[index] = selectedId;
    setSelectedMembers(newSelectedMembers);
  };

  const handleCustomFieldChange = (index, value) => {
    // Update the state with the entered email value
    const newCustomFieldValues = [...customFieldValues];
    newCustomFieldValues[index] = value;
    setCustomFieldValues(newCustomFieldValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const signers = template.signerRoles.map((signerRole, index) => {
      return {
        role: signerRole.name,
        teamMemberId: selectedMembers[index] || null,
      };
    });

    const customFields = template.customFields.map((customField, index) => {
      return {
        name: customField.name,
        value: customFieldValues[index],
      };
    });

    const payload = {
      signers,
      customFields,
      templateId: template.templateId,
    };

    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/esignatures/dropbox/embeddedSignatureRequestWithTemplate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          toast.success("Success!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } else {
          toast.error("Something wrong!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }

        console.log(data);
      })
      .catch((error) => {
        toast.error("Something wrong!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        console.log(error);
      });

    console.log("payload?", payload);
  };

  const handleSignatureReq = async (id) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/esignatures/dropbox/embeddedSignatureRequest/${id}`
      );

      const data = await response.json();
      setSigningUrl(data.embedded.signUrl);
    } catch (error) {
      toast.error(
        "Cannot generate URL for embedded signature, take into account order and status"
      );
    }
  };

  return (
    <div>
      <Row className="justify-content-center my-4">
        <Col md={8}>
          <h3>Signatures</h3>
          {/* <form onSubmit={handleSubmit}> */}

          {template && (
            <>
              <form onSubmit={handleSubmit}>
                {template.signerRoles.map((signerRole, index) => (
                  <Row key={index}>
                    <Col md={6}>
                      <label>
                        Select {`${signerRole.name}`} - Team Member:
                      </label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          handleSelectChange(e, index);
                        }}
                      >
                        <option value="">Select a team member</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>
                ))}

                {template.customFields.map((cf, index) => (
                  <div className="form-group my-2" key={index}>
                    <label htmlFor="signerRole">{cf.name}</label>
                    <input
                      type="text"
                      className="form-control"
                      id="signerRole"
                      aria-describedby="signerRole"
                      name={`customFields[${index}]`}
                      onChange={(e) =>
                        handleCustomFieldChange(index, e.target.value)
                      }
                      required
                      placeholder="Enter custom value"
                    />
                  </div>
                ))}
                <div className="form-group my-2">
                  <button type="submit" className="btn btn-primary">
                    Send Signature Request
                  </button>
                </div>
              </form>
            </>
          )}
        </Col>
      </Row>
      <Row className="my-4 justify-content-center">
        <Col md={8}>
          {signatureRequests.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <td>Request Id</td>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>embedded</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {signatureRequests.map((signatureRequest) => (
                  <tr key={signatureRequest.id}>
                    <td>{signatureRequest.requestId}</td>
                    <td>{signatureRequest.email}</td>
                    <td>{signatureRequest.name}</td>
                    <td>
                      <Badge bg="primary">{signatureRequest.status}</Badge>
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => {
                          handleSignatureReq(signatureRequest.signatureId);
                        }}
                      >
                        <FaFileSignature />
                      </Button>
                    </td>
                    <td>
                      {signatureRequest.pdf && (
                        <DownloadButton
                          key={signatureRequest.requestId}
                          base64Pdf={signatureRequest.pdf}
                          fileName={signatureRequest.requestId}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>{signingUrl && <Sign signingUrl={signingUrl} />}</Col>
      </Row>
      <ToastContainer />
    </div>
  );
};
