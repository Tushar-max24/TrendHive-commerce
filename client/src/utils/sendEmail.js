import emailjs from "emailjs-com";

export const sendStatusEmail = async (email, orderId, orderStatus, totalAmount) => {
  try {
    const appUrl = window.location.origin;

    const templateParams = {
      userEmail: email,
      orderId,
      orderStatus,
      totalAmount,
      trackingLink: `${appUrl}/order/${orderId}`,
    };

    // 👇 SELECT TEMPLATE BASED ON STATUS
    const templateId =
      orderStatus === "Cancelled"
        ? "template_bvypb3n"
        : "template_prwg0vg"; // normal updates template

    const response = await emailjs.send(
      "service_8o69f9b", // service ID
      templateId,        // 🔥 now dynamic template ID
      templateParams,
      "GF4hoB5UBxx3CEeWV"
    );

    console.log("📨 Email sent:", response);
  } catch (error) {
    console.error("❌ Email Send Failed:", error);
    alert("Email sending failed: " + (error.text || error.message));
  }
};
