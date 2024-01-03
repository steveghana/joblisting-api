import {
  Controller,
  Get,
  UseFilters,
  Res,
  Post,
  Req,
  Logger,
  Next,
} from '@nestjs/common';
import emailUtil from '../../../util/email';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../../middleware/err.Middleware';
import { Response } from 'express';

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/gu, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
    }
    return c;
  });
}
@Controller(`/contact`)
export class ContactController {
  // constructor() {}

  /* ===================== */

  @ApiTags('Send email notification')
  @Post('/')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({
    description: 'send email to user',
  })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  // @UseInterceptors(CacheInterceptor)
  async getVapidPublicKey(@Next() next, @Res() res: Response, @Req() req) {
    const { subject, recipients, message } = req.body;
    const emails = recipients.map((item) => item.email);
    // for (let i = 0; i < reciepients?.length; i++) {
    // Check if recipients is an array
    if (Array.isArray(recipients) && recipients.length > 0) {
      const emailContent = `
    <div style="font-family: 'Arial', sans-serif; color: #333;">
      <h1>Hello ${recipients[0]?.name},</h1>
      <p>
        <strong>Your Message:</strong><br/>
        ${message}
      </p>
      <p>
        If you have any urgent inquiries or need immediate assistance, please feel free to contact us directly at careers@savannahTech.io</a>.
      </p>
      <p>
        Best regards,<br/>
        The Savannah Tech Team
      </p>
    </div>
  `;
      const mail = {
        from: 'boatengstephen707@gmail.com',
        to: emails,
        subject: subject,
        text: 'Hello, This email contains attachments',
        html: emailContent,
        // attachments: [
        //   {
        //     path: 'data:text/plain;base64,aGVsbG8gd29ybGQ=',
        //     cid: 'cid:molo.txt',
        //   },
        // ],
      };
      // Send the email with emailContent
      await emailUtil.sendStyled(mail);
    } else {
      console.error('Invalid recipients data:', recipients);
    }

    // }
    // console.log(send);
    res.status(200).send({
      success: true,
      message: 'Email sent successfully',
    });
  }

  /* ===================== */

  /* ===================== */

  /* ===================== */
}
