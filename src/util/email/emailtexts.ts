import { IDev } from '../../types/developer';
import { Dependencies, injectDependencies } from '../dependencyInjector';

export const DeveloperAcceptedEmailDraft = async (
  dev: IDev,
  dependencies: Dependencies = null,
) => {
  dependencies = injectDependencies(dependencies, ['email']);

  // Remember to change the credentials to Url encoded link
  //   console.log('sending email', dev.user);
  return await dependencies.email.sendStyled({
    to: [dev.user.email],
    subject: 'Your Role Application has been Accepted',
    html: `<h1>Congratulations!</h1>
      <p>We are pleased to inform you that your application has been accepted.</p>
      <h2>Role Details:</h2>
    
      <h2>Limited Access:</h2>
      <p>You can now access a restricted part of our system related to the applied role. Please follow the instructions below:</p>
      <ol>
        <li>Access the Savannah Tech portal.</li>
        <li>Use the following temporary credentials:
          <ul>
            <li><strong>email:</strong> ${dev.user.email}</li>
            <li><strong>Password:</strong>${dev.user.password}</li>
          </ul>
        </li>
      </ol>
      <h2>Next Steps:</h2>
      <p>Once you log in, you'll be prompted to complete your registration by providing additional information and setting up a permanent username and password.</p>
      <p>If you have any questions or need assistance, please contact our support team at [Support Email or Phone Number].</p>
      <p>Thank you for choosing [Your Company Name]!</p>
      <p>Best regards,<br>Savannah Tech.io</p>`,
  });
};
