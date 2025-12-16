import type { User } from '@domain/users/user.model';

import { usersActions } from './users.actions';
import { usersReducer } from './users.feature';

describe('usersReducer', () => {
  it('sets listLoading on Load Users', () => {
    const state = usersReducer(undefined, usersActions.loadUsers());
    expect(state.listLoading).toBe(true);
  });

  it('stores users on Load Users Success', () => {
    const users: User[] = [
      {
        id: 'u_1',
        email: 'a@a.test',
        firstName: 'Ada',
        lastName: 'Admin',
        isActive: true,
        createdAtIso: new Date().toISOString(),
      },
    ];

    const state = usersReducer(undefined, usersActions.loadUsersSuccess({ users }));

    expect(state.listLoading).toBe(false);
    expect(state.ids).toEqual(['u_1']);
  });
});
