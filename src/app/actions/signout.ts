// app/actions/signout.ts
'use server';

import { signOut } from '@auth';

export async function signOutAction() {
  await signOut();
}
