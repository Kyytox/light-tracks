// QRCode
import React from "react";
import QRCode from "qrcode.react";

function QrCode({ infosInvoice }) {
    return (
        <div>
            <QRCode
                value={infosInvoice.payementRequest}
                width="1000"
                height="1000"
                includeMargin={true}
                level="L"
                renderAs="canvas"
            />
            {/* <p>Send {infosAlbum.a_price} satoshis to the address above</p> */}
        </div>
    );
}

export default QrCode;
