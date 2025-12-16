import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { MOCK_CREDENTIALS } from '@domain/constants';

import { ConfirmService } from '@core/notifications/confirm.service';

import { UsersFacade } from '../../data-access/users.facade';
import { UsersListPageComponent } from './users-list-page.component';

describe('UsersListPageComponent', () => {
  it('loads users on init and renders rows', async () => {
    const facadeStub: Pick<UsersFacade, 'users$' | 'listLoading$' | 'loadUsers' | 'deleteUser'> = {
      users$: of([
        {
          id: 'u_1',
          email: MOCK_CREDENTIALS.admin.email,
          firstName: 'Ada',
          lastName: 'Admin',
          isActive: true,
          createdAtIso: new Date().toISOString(),
        },
      ]),
      listLoading$: of(false),
      loadUsers: vi.fn(),
      deleteUser: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UsersListPageComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        {
          provide: ConfirmService,
          useValue: {
            confirm: vi.fn(),
            confirmDelete: vi.fn(),
          },
        },
        { provide: UsersFacade, useValue: facadeStub },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(UsersListPageComponent);
    fixture.detectChanges();

    expect(facadeStub.loadUsers).toHaveBeenCalledTimes(1);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Users');
    expect(el.textContent).toContain('Ada Admin');
  });
});
