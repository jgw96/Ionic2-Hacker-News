import { Component } from "@angular/core";
import { NavController, Loading } from "ionic-angular";

import { StoriesService } from "../../providers/stories/stories";
import { CommentsPage } from "../../pages/comments/comments";
import { UnixDate } from "../../pipes/unixDate";

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [StoriesService],
  pipes: [UnixDate]
})
export class HomePage {

  stories: any[];
  storyIDs: any;
  previousIndex: number;

  constructor(private nav: NavController, private storiesService: StoriesService) {
    this.stories = [];
  }

  ionViewDidEnter() {
    if (sessionStorage.getItem("loaded") === "true") {
      return;
    } else {
      let loading = Loading.create({
        content: "Getting Stories..."
      });

      this.nav.present(loading).then(() => {
        this.storiesService.getStories()
          .subscribe(
          data => {
            this.storyIDs = data;
            console.log(data);
            this.previousIndex = 480;
            for (let i = 0; i < this.storyIDs.length - this.previousIndex; i++) {
              this.storiesService.getStory(data[i])
                .subscribe(
                data => {
                  console.log(data);
                  this.stories.push(data);
                  loading.dismiss();
                  sessionStorage.setItem("loaded", "true");
                }
                )
            }
          },
          error => {
            console.log(error);
          }
          )
      })
    }
  }

  private getComments(data: any): void {
    console.log(data);
    this.nav.push(CommentsPage, { data: data });
  }

  private open(url: string) {
    window.open(url);
  }

  doInfinite(infiniteScroll: any) {
    let newIndex = this.previousIndex - 20;
    for (let i = this.previousIndex; i > newIndex; i--) {
      this.storiesService.getStory(this.storyIDs[i])
         .subscribe(
           data => {
             console.log(data);
             this.stories.push(data);
           },
           error => {
             console.log(error);
           }
         )
    }
    infiniteScroll.complete();
    this.previousIndex = newIndex;
  }

}
