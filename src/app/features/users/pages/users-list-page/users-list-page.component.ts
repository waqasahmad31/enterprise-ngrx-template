import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

import type { User } from '@domain/users/user.model';

import { ConfirmService } from '@core/notifications/confirm.service';

import { UsersFacade } from '../../data-access/users.facade';

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListPageComponent implements OnInit, AfterViewInit {
  private readonly facade = inject(UsersFacade);
  private readonly confirms = inject(ConfirmService);

  readonly users$ = this.facade.users$;
  readonly loading$ = this.facade.listLoading$;

  readonly displayedColumns = ['name', 'email', 'active', 'actions'] as const;
  readonly dataSource = new MatTableDataSource<User>([]);
  filterValue = '';

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor() {
    this.dataSource.filterPredicate = (user, filter) => {
      const term = (filter ?? '').toString().trim().toLowerCase();
      if (!term) return true;

      const haystack = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
      return haystack.includes(term);
    };

    this.dataSource.sortingDataAccessor = (user, property) => {
      switch (property) {
        case 'name':
          return `${user.firstName} ${user.lastName}`;
        case 'email':
          return user.email;
        case 'active':
          return user.isActive ? '1' : '0';
        default:
          return (user as never as Record<string, unknown>)[property] as string;
      }
    };

    this.users$.pipe(takeUntilDestroyed()).subscribe((users) => {
      this.dataSource.data = users;
      this.applyFilter(this.filterValue);
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngAfterViewInit(): void {
    if (this.sort) this.dataSource.sort = this.sort;
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  refresh(): void {
    this.facade.loadUsers();
  }

  applyFilter(value: string): void {
    this.filterValue = (value ?? '').toString();
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  delete(user: User): void {
    this.confirms.confirmDelete('user', () => this.facade.deleteUser(user.id));
  }
}
