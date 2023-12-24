import React from "react";
import HelloSign from "hellosign-embedded";

const client = new HelloSign({
  clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID,
});
console.log("client?", client);

const Sign = ({ signingUrl, onSign, onCancel, onError, onFinish, onClose }) => {
  React.useEffect(() => {
    // Bind callback props to event handlers.
    if (onSign) client.on("sign", onSign);
    if (onCancel) client.on("cancel", onCancel);
    if (onClose) client.on("close", onClose);
    if (onError) client.on("error", onError);
    if (onFinish) client.on("finish", onFinish);

    // Makes sure the event handlers are cleaned up before this runs again.
    return () => {
      client.off("sign", onSign);
      client.off("cancel", onCancel);
      client.off("error", onError);
    };
  }, [onSign, onCancel, onError, onFinish, onClose]);

  React.useEffect(
    function () {
      if (signingUrl) {
        console.log("signingUrl?", signingUrl);
        client.open(signingUrl, {
          testMode: true,
          skipDomainVerification: true,
          allowCancel: true,
          hideHeader: true,
        });
      }
    },
    [signingUrl]
  );

  return <></>;
};

export default Sign;
