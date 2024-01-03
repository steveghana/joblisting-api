import nodemailer, { Transporter, createTransport } from 'nodemailer';
import * as mailjetTransport from 'nodemailer-mailjet-transport';
import logger from '../log';
import * as mailjet from 'node-mailjet';
export type Context = {
  transporter: Transporter;
};

export const globalContext: Context = {
  transporter: null,
};

function init(context: Context = globalContext): Context {
  console.log('email service initialised');
  // context.transporter = createTransport(
  //   mailjetTransport({
  //     auth: {
  //       apiKey: process.env.MAILJET_API_KEY,
  //       apiSecret: process.env.MAILJET_API_SECRET,
  //     },
  //     debug: true,
  //   }),
  // );
  context.transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
  });
  return context;
}

export type SendOptions = {
  from?: string;
  to: string | string[];
  sender?: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
    cid?: string;
  }[];
};

export type SendReturn = {
  messageId?: string;
  envelope?: any;
  accepted?: Array<any>;
  rejected?: Array<any>;
  pending?: Array<any>;
  response?: string;
};

async function send(
  options: SendOptions,
  context: Context = globalContext,
): Promise<SendReturn> {
  try {
    if (!context.transporter) {
      throw new Error('Email service not initialised');
    }
    const info = await context.transporter.sendMail(options);
    return {
      messageId: info.messageId,
      envelope: info.envelope,
      accepted: info.accepted,
      rejected: info.rejected,
      pending: info.pending,
      response: info.response,
    };
  } catch (error) {
    logger.error('Error sending email:', error);
    return {
      response: 'Error sending email',
    };
  }
}

function sendStyled(
  options: SendOptions,
  context: Context = globalContext,
): Promise<SendReturn> {
  console.log('ine sendint ........................');
  return send(
    {
      ...options,
      html: `<html>
    <head>
        <style>
            body {
                font-family: 'Poppins', sans-serif;
                font-size: 19px;
                color: #000;
            }

            a {
                color: #5bc6f9;
            }

            h1, h2, h3, h4, h5 {
                margin: 0;
                margin-bottom: 0.25em;
                color: #5bc6f9;
                font-size: 1.5em;
                text-align: center;
            }
        </style>
    </head>
    <body>${options.html}</body>
</html>`,
    },
    context,
  );
}

export default {
  init,
  send,
  sendStyled,
};
