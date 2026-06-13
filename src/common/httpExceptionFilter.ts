import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response, Request } from "express"; // 👈 add this
import { GoogleService } from "../google/google.service";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly googleService: GoogleService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); // now resolves to express.Response
    const request = ctx.getRequest<Request>(); // now resolves to express.Request
    const status = exception.getStatus();
    const body = exception.getResponse() as any;

    const message = body?.message || "An error occurred";

    this.logger.error(
      `[${request.method}] ${request.url} - ${status} | ${message} ${JSON.stringify(body?.errors)}`,
      exception.stack,
    );
    if (request?.url?.includes("sheet-to-report")) {
      const subject = `Zoho EOD APP [${status}] Error on ${request.method} ${request.url}`;
      const html = `
      <h2>Error Notification</h2>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Method:</strong> ${request.method}</p>
      <p><strong>URL:</strong> ${request.url}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Errors:</strong> ${JSON.stringify(body?.errors || [])}</p>
      <pre><strong>Stack:</strong> ${exception.stack}</pre>
    `;

      this.googleService
        .configTransporter()
        .then(async (transporter) => {
          await transporter.verify();
          return transporter.sendMail({
            from: process.env.GOOGLE_EMAIL ?? "",
            to: process.env.GOOGLE_EMAIL ?? "",
            subject,
            html,
          });
        })
        .then((result) => {
          this.logger.log(`Email sent. MessageId: ${result.messageId}`);
        })
        .catch((mailError) => {
          this.logger.error(
            "Failed to send error notification email",
            mailError,
          );
        });
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors: body?.errors || [],
    });
  }
}
