/**
 * Email & Notification Service
 * Single Responsibility: handles order confirmations and delivery notifications.
 */

class EmailService {
  async sendOrderConfirmation({ recipientEmail, customerName, cardSlug, amount }) {
    const cardUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/card/${cardSlug}`;
    console.log(`\n======================================================`);
    console.log(`[Notification Service] 💌 ORDER CONFIRMATION SENT`);
    console.log(`To: ${recipientEmail || 'Customer'}`);
    console.log(`Name: ${customerName}`);
    console.log(`Amount: ₹${amount}`);
    console.log(`Surprise Link: ${cardUrl}`);
    console.log(`======================================================\n`);

    return {
      sent: true,
      deliveredAt: new Date().toISOString(),
      cardUrl
    };
  }
}

module.exports = new EmailService();
