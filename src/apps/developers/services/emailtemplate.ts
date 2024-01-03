import { IRole } from '@/types/role';

export const DeveloperAcceptedEmailDraft = (
  role: IRole,
  email: string,
  dummyTemporalPassword: string,
) => {
  return `<h1>Congratulations!</h1>
      <p>We are pleased to inform you that your application for the [Role Name] role has been accepted.</p>
      <h2>Role Details:</h2>
      <ul>
        <li><strong>Role:</strong>${role.title}</li>
        <li><strong>Description:</strong>${role.aboutTheProject}</li>
        <li><strong>Start Date:</strong>${role.createdAt}</li>
      </ul>
      <h2>Limited Access:</h2>
      <p>You can now access a restricted part of our system related to the applied role. Please follow the instructions below:</p>
      <ol>
        <li>Access the Savannah Tech portal.</li>
        <li>Use the following temporary credentials:
        
          <ul>
            <li><strong>email:</strong> ${email}</li>
            <li><strong>Password:</strong>${dummyTemporalPassword}</li>
          </ul>
        </li>
      </ol>
      <h2>Next Steps:</h2>
      <p>Once you log in, you'll be prompted to complete your registration by providing additional information and setting up a permanent username and password.</p>
      <p>If you have any questions or need assistance, please contact our support team at [Support Email or Phone Number].</p>
      <p>Thank you for choosing [Your Company Name]!</p>
      <p>Best regards,<br>Savannah Tech.io</p>`;
};
