import { siteConfig } from '@/config/site.config';
import type { IOrder } from '@/models/Order';

export class EmailService {
  private formatCurrency(paise: number): string {
    return `₹${(paise / 100).toLocaleString('en-IN')}`;
  }

  /**
   * Generates royal couture HTML email template for order confirmation
   */
  private generateOrderConfirmationHtml(order: IOrder): string {
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #E8E5DF; font-family: 'Playfair Display', Georgia, serif;">
            <strong style="color: #1C1A17;">${item.name}</strong>
            ${item.size ? `<br/><span style="font-size: 11px; color: #7D756C; font-family: sans-serif;">Size: ${item.size}</span>` : ''}
            ${item.color ? `<span style="font-size: 11px; color: #7D756C; font-family: sans-serif;"> | Color: ${item.color}</span>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E8E5DF; text-align: center; color: #1C1A17; font-family: sans-serif; font-size: 13px;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E8E5DF; text-align: right; color: #1C1A17; font-family: sans-serif; font-size: 13px; font-weight: 600;">
            ${this.formatCurrency(item.totalPrice)}
          </td>
        </tr>
      `
      )
      .join('');

    const shipping = order.shippingAddress;
    const addressStr = [
      shipping.line1,
      shipping.line2,
      `${shipping.city}, ${shipping.state} ${shipping.pincode}`,
      shipping.country || 'India',
    ]
      .filter(Boolean)
      .join(', ');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aafreencouture.com';
    const trackOrderUrl = `${appUrl}/orders/${order._id}`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation — ${siteConfig.name}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8F6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F6F0; padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 1px solid #E8E5DF; box-shadow: 0 4px 12px rgba(0,0,0,0.03); max-width: 600px; width: 100%;">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 35px 20px 25px; border-bottom: 2px solid #C49A5A; background-color: #1C1A17;">
                    <h1 style="margin: 0; color: #C49A5A; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; letter-spacing: 4px; text-transform: uppercase;">
                      AAFREEN COUTURE
                    </h1>
                    <p style="margin: 6px 0 0; color: #E8E5DF; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
                      Haute Couture & Heritage Bespoke
                    </p>
                  </td>
                </tr>

                <!-- Greeting & Status -->
                <tr>
                  <td style="padding: 30px 35px 20px;">
                    <h2 style="margin: 0 0 10px; font-family: 'Playfair Display', Georgia, serif; color: #1C1A17; font-size: 20px;">
                      Thank you for your order, ${shipping.name || 'Valued Client'}
                    </h2>
                    <p style="margin: 0; color: #524B43; font-size: 14px; line-height: 1.6;">
                      Your payment has been successfully processed and verified via <strong>Razorpay</strong>. Our master artisans have received your order details and are preparing your pieces with the finest craftsmanship.
                    </p>
                  </td>
                </tr>

                <!-- Order Badge -->
                <tr>
                  <td style="padding: 0 35px 25px;">
                    <table width="100%" style="background-color: #FAF8F5; border: 1px solid #E8E5DF; padding: 15px; border-radius: 2px;">
                      <tr>
                        <td style="font-size: 12px; color: #7D756C;">
                          <strong>Order Number:</strong> <span style="color: #1C1A17; font-weight: 600;">${order.orderNumber}</span><br/>
                          <strong>Payment Status:</strong> <span style="color: #059669; font-weight: 600;">PAID & CONFIRMED</span><br/>
                          ${order.razorpayPaymentId ? `<strong>Payment Ref ID:</strong> <span style="color: #1C1A17;">${order.razorpayPaymentId}</span><br/>` : ''}
                          <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Itemized List -->
                <tr>
                  <td style="padding: 0 35px 20px;">
                    <h3 style="margin: 0 0 12px; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: #1C1A17; border-bottom: 1px solid #1C1A17; padding-bottom: 6px;">
                      Order Summary
                    </h3>
                    <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                      <thead>
                        <tr style="background-color: #FAF8F5; font-size: 11px; color: #7D756C; text-transform: uppercase; letter-spacing: 1px;">
                          <th align="left" style="padding: 8px 12px;">Ensemble</th>
                          <th align="center" style="padding: 8px 12px;">Qty</th>
                          <th align="right" style="padding: 8px 12px;">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Total Breakdown -->
                <tr>
                  <td style="padding: 0 35px 25px;">
                    <table width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="right" style="padding: 4px 0; font-size: 13px; color: #7D756C;">Subtotal:</td>
                        <td align="right" style="padding: 4px 0 4px 20px; font-size: 13px; color: #1C1A17; font-weight: 600;">${this.formatCurrency(order.subtotal)}</td>
                      </tr>
                      <tr>
                        <td align="right" style="padding: 4px 0; font-size: 13px; color: #7D756C;">Shipping:</td>
                        <td align="right" style="padding: 4px 0 4px 20px; font-size: 13px; color: #1C1A17;">${order.shippingCharge === 0 ? 'Complimentary' : this.formatCurrency(order.shippingCharge)}</td>
                      </tr>
                      ${order.discount > 0 ? `
                      <tr>
                        <td align="right" style="padding: 4px 0; font-size: 13px; color: #059669;">Discount:</td>
                        <td align="right" style="padding: 4px 0 4px 20px; font-size: 13px; color: #059669; font-weight: 600;">-${this.formatCurrency(order.discount)}</td>
                      </tr>` : ''}
                      <tr>
                        <td align="right" style="padding: 10px 0 0; font-size: 15px; font-weight: 700; color: #1C1A17; border-top: 2px solid #C49A5A;">Total:</td>
                        <td align="right" style="padding: 10px 0 0 20px; font-size: 16px; font-weight: 700; color: #C49A5A; border-top: 2px solid #C49A5A;">${this.formatCurrency(order.total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Shipping Address -->
                <tr>
                  <td style="padding: 0 35px 30px;">
                    <h3 style="margin: 0 0 8px; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #1C1A17;">
                      Delivery Address
                    </h3>
                    <p style="margin: 0; font-size: 13px; color: #524B43; line-height: 1.5;">
                      <strong>${shipping.name}</strong><br/>
                      ${addressStr}<br/>
                      Phone: ${shipping.phone || 'N/A'}
                    </p>
                  </td>
                </tr>

                <!-- Action CTA -->
                <tr>
                  <td align="center" style="padding: 0 35px 35px;">
                    <a href="${trackOrderUrl}" style="display: inline-block; background-color: #1C1A17; color: #FFFFFF; text-decoration: none; padding: 14px 28px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; border-radius: 2px;">
                      View Order Details
                    </a>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 25px 20px; background-color: #FAF8F5; border-top: 1px solid #E8E5DF; font-size: 11px; color: #7D756C;">
                    <p style="margin: 0 0 6px;">Questions regarding your order? Contact our concierge team at <a href="mailto:support@aafreencouture.com" style="color: #C49A5A; text-decoration: none;">support@aafreencouture.com</a></p>
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Aafreen Couture. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * Dispatches order confirmation email to the customer and alert copy to admin
   */
  async sendOrderConfirmation(order: IOrder): Promise<boolean> {
    const recipient = order.shippingAddress?.email;
    if (!recipient) {
      console.warn(`[EmailService] Order ${order.orderNumber} has no email address. Skipping email.`);
      return false;
    }

    const html = this.generateOrderConfirmationHtml(order);
    const subject = `Order Confirmed: ${order.orderNumber} — ${siteConfig.name}`;

    try {
      // 1. Try Resend if configured
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const { resend, FROM_EMAIL } = await import('@/lib/resend');
        await resend.emails.create({
          from: FROM_EMAIL,
          to: [recipient],
          subject,
          html,
        });

        // Also notify admin
        const adminEmail = process.env.ADMIN_EMAIL || 'support@aafreencouture.com';
        if (adminEmail && adminEmail !== recipient) {
          await resend.emails.create({
            from: FROM_EMAIL,
            to: [adminEmail],
            subject: `[NEW ORDER] ${order.orderNumber} Paid via Razorpay — ${this.formatCurrency(order.total)}`,
            html,
          }).catch((err) => console.warn('[EmailService] Admin copy error:', err));
        }

        console.log(`[EmailService] Order confirmation sent via Resend to ${recipient}`);
        return true;
      }

      // 2. Fallback / Log notification for development or if RESEND_API_KEY not set
      console.log(
        `[EmailService] Order confirmation email prepared for ${recipient} (Order #${order.orderNumber}, Amount: ${this.formatCurrency(order.total)}). To send live emails, configure RESEND_API_KEY in .env.local.`
      );
      return true;
    } catch (error) {
      console.error('[EmailService] Failed to send order confirmation email:', error);
      return false;
    }
  }

  /**
   * Dispatches payment failed alert to customer
   */
  async sendPaymentFailedNotification(order: IOrder, reason?: string): Promise<boolean> {
    const recipient = order.shippingAddress?.email;
    if (!recipient) return false;

    const subject = `Payment Incomplete for Order ${order.orderNumber} — ${siteConfig.name}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #1C1A17;">
        <h2 style="color: #DC2626;">Payment Incomplete</h2>
        <p>Dear ${order.shippingAddress.name || 'Customer'},</p>
        <p>Your recent payment attempt for order <strong>${order.orderNumber}</strong> was not completed (${reason || 'Transaction could not be processed'}).</p>
        <p style="background: #FEE2E2; padding: 12px; border-radius: 4px; color: #991B1B;">
          <strong>Important:</strong> No money has been deducted from your account. Your selected items remain saved.
        </p>
        <p>You may return to your checkout to retry with another card, UPI, or select Cash on Delivery.</p>
        <p>Warm regards,<br/>Aafreen Couture Concierge</p>
      </div>
    `;

    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const { resend, FROM_EMAIL } = await import('@/lib/resend');
        await resend.emails.create({
          from: FROM_EMAIL,
          to: [recipient],
          subject,
          html,
        });
        return true;
      }
      console.log(`[EmailService] Payment failure notice prepared for ${recipient}`);
      return true;
    } catch (e) {
      console.error('[EmailService] Failed to send payment failed email:', e);
      return false;
    }
  }
}

export const emailService = new EmailService();
