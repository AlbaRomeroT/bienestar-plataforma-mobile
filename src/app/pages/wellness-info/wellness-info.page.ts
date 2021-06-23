import { Component, OnInit } from '@angular/core';
import { NavigationBackService } from '../../services/navigation-back.service';

@Component({
  selector: 'app-wellness-info',
  templateUrl: './wellness-info.page.html',
  styleUrls: ['./wellness-info.page.scss'],
})
export class WellnessInfoPage implements OnInit {

  public title: string = "Mi índice de bienestar";
  busy: boolean = false;

  constructor(private navigationBackService: NavigationBackService) { }

  ngOnInit() {
  }

  goBack() {
    this.navigationBackService.back();
    setTimeout(() => {
      this.busy = false
    }, 800);
  }

}
