
import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'chart.js';

declare var Chart: any;

@Component({
  selector: 'page-in-visum-faq',
  templateUrl: 'in-visum-faq.html',
  
})

export class InVisumFAQPage {
  @ViewChild('canvas') private canvas:ElementRef;
  myChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
  }
  
  ngAfterViewInit() {
    let ctx = this.canvas.nativeElement;
    this.myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['yolo', 'dolo', 'solo'],
        datasets: [{
          data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
      }
    });
  }
  
}

