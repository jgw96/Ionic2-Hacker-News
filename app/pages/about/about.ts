import { Component } from '@angular/core';
import { NavController, Loading } from "ionic-angular";
import { SocialSharing } from 'ionic-native';

import { StoriesService } from '../../providers/stories/stories';

@Component({
  templateUrl: 'build/pages/about/about.html',
  providers: [StoriesService]
})
export class AboutPage {

  jobs: any[];

  constructor(private navController: NavController, private storiesService: StoriesService) {
    this.jobs = [];
  }

  ionViewDidEnter() {
    let loading = Loading.create({
      content: 'Getting Jobs...'
    });
    this.navController.present(loading).then(() => {
      this.storiesService.getJobStories()
        .subscribe(
        (data: any) => {
          data.forEach((id: any) => {
            this.storiesService.getStory(id)
              .subscribe(
              (data: any) => {
                console.log(data);
                this.jobs.push(data);
                loading.dismiss();
              },
              (err: Error) => {
                console.log(err);
              }
              );
          });
        },
        (err: Error) => {
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
