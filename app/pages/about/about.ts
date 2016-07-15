import { Component } from '@angular/core';
import { NavController, LoadingController } from "ionic-angular";
import { SocialSharing } from 'ionic-native';

import { StoriesService } from '../../providers/stories/stories';

@Component({
  templateUrl: 'build/pages/about/about.html',
  providers: [StoriesService]
})
export class AboutPage {

  jobs: any[];

  constructor(private navController: NavController, private storiesService: StoriesService, private loading: LoadingController) {
    this.jobs = [];
  }

  ionViewDidEnter() {
    let loading = this.loading.create({
      content: 'Getting Jobs...'
    });
    loading.present().then(() => {
      this.storiesService.getJobStories()
        .subscribe(
        data => {
          data.forEach((id: any) => {
            this.storiesService.getStory(id)
              .subscribe(
              data => {
                console.log(data);
                this.jobs.push(data);
                loading.dismiss();
              },
              err => {
                console.log(err);
              }
              );
          });
        },
        err => {
          console.log(err);
        }
        );
    });
  }

  private goTo(site: string) {
    window.open(site);
  }

  private share(url: string) {
    SocialSharing.share('Looking for a job?', null, null, url);
  }
}
