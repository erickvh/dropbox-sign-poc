import { Button } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa";

const DownloadButton = ({ base64Pdf, fileName }) => {
  const handleDownload = () => {
    const byteCharacters = atob(base64Pdf);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName || "document.pdf";
    link.click();
  };

  return (
    <Button onClick={handleDownload}>
      <FaFilePdf />
    </Button>
  );
};

export default DownloadButton;
