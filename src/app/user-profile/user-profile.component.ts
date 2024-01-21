import { Component } from '@angular/core';
import {BackendService} from "../backend.service";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {NgFor, NgIf} from "@angular/common";
import {UserInfo} from "../models/user-info";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgFor, NgIf],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.less'
})
export class UserProfileComponent {
  public userInfo!: UserInfo | undefined
  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.service.getUserInfo()
      .subscribe(info => {
        this.userInfo = info
      })
  }

}
