import { Component } from '@angular/core';
import { AngularFire, AuthProviders } from 'angularfire2';

@Component({
  moduleId: module.id,
  selector: 'theater',
  template: `
  <md-grid-list cols="10" class="auditorium" [ngClass]="{ animate: animate }">
   <md-grid-tile  *ngFor="let seat of list | async">
     <button md-raised-button [ngClass]="{ booked: seat.booked, reserved: seat.reserved }" [title]="seat.description" (click)="book(seat)" class="seat">
     {{ seat.seat }}
     </button>
   </md-grid-tile>
</md-grid-list>
  `,
  styleUrls: ['theater.component.css']
})
export class Theater{

    animate:boolean;
    list;

    constructor(public af:AngularFire){

        setTimeout(() => {
            this.animate = true;
        },100);

        this.initSeats();
    }

    private initSeats(){
        this.list = this.af.database.list('/seats');
        // this.list.remove();
        //
        //
        // for(var i=0; i< 100; i++) {
        //     this.list.push({ seat: i + 1, reserved : false, booked : false });
        // }
    }

    book(seat) {


        var db = this.af.database.list('/seats');

        if(seat.booked) {
            seat.booked = false;
            seat.reserved;
        } else if(seat.reserved) {
            seat.booked = true;
            seat.reserved = false;
        } else if(seat.booked) {
            seat.booked = false;
        } else {
            seat.reserved = true;
        }

        db.update(seat.$key, {
            booked : seat.booked,
            reserved : seat.reserved
        }).then(() => {
           // show spinner
        }, err => console.log(err) );

    }
}
