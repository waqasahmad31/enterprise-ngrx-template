import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AppConfigService } from '@core/config/app-config.service';

import { API_PATHS } from '@domain/constants';
import type { User, UserCreate, UserUpdate } from '@domain/users/user.model';

@Injectable()
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  private url(path: string): string {
    return `${this.config.config().apiBaseUrl}${path}`;
  }

  list(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(this.url(API_PATHS.users.root)));
  }

  getById(id: string): Promise<User> {
    return firstValueFrom(this.http.get<User>(this.url(API_PATHS.users.byId(id))));
  }

  create(payload: UserCreate): Promise<User> {
    return firstValueFrom(this.http.post<User>(this.url(API_PATHS.users.root), payload));
  }

  update(id: string, patch: UserUpdate): Promise<User> {
    return firstValueFrom(this.http.put<User>(this.url(API_PATHS.users.byId(id)), patch));
  }

  delete(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(this.url(API_PATHS.users.byId(id))));
  }
}
