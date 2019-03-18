import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuth = false;
  private userAuthListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userAuth = this.authService.isUserLoged();
    this.userAuthListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(authState => {
        this.userAuth = authState;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.userAuthListenerSubs) {
      this.userAuthListenerSubs.unsubscribe();
    }
  }
}
