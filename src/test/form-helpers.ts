import { screen } from '@testing-library/react';
import type userEvent from '@testing-library/user-event';
import { COUNTRIES } from '../constants/countries';

type User = ReturnType<typeof userEvent.setup>;

export function createPngFile(name = 'photo.png', size = 4): File {
  return new File([new Uint8Array(size)], name, { type: 'image/png' });
}

async function uploadImageFile(user: User, fileName = 'photo.png') {
  await user.upload(screen.getByLabelText(/^Image$/i), createPngFile(fileName));
}

export async function fillValidUncontrolledForm(user: User) {
  await user.type(screen.getByLabelText(/^Name$/i), 'John');
  await user.type(screen.getByLabelText(/^Age$/i), '30');
  await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com');
  await user.selectOptions(screen.getByLabelText(/^Gender$/i), 'male');
  await uploadImageFile(user);
  await user.type(screen.getByLabelText(/^Password$/i), 'Password1!');
  await user.type(screen.getByLabelText(/^Confirm password$/i), 'Password1!');
  await user.type(screen.getByLabelText(/^Country$/i), COUNTRIES[0]);
  await user.click(screen.getByLabelText(/Terms and Conditions/i));
}

export async function fillValidHookForm(user: User) {
  await user.type(screen.getByLabelText(/^Name$/i), 'Jane');
  await user.type(screen.getByLabelText(/^Age$/i), '28');
  await user.type(screen.getByLabelText(/^Email$/i), 'jane@example.com');
  await user.selectOptions(screen.getByLabelText(/^Gender$/i), 'female');
  await uploadImageFile(user, 'avatar.png');
  await user.type(screen.getByLabelText(/^Password$/i), 'Secret1!');
  await user.type(screen.getByLabelText(/^Confirm password$/i), 'Secret1!');
  await user.type(screen.getByLabelText(/^Country$/i), COUNTRIES[1]);
  await user.click(screen.getByLabelText(/Terms and Conditions/i));
}
