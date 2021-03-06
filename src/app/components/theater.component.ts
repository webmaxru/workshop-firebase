import { Component } from '@angular/core';
import { AngularFire, AuthProviders } from 'angularfire2';

@Component({
  moduleId: module.id,
  selector: 'theater',
  template: `
    <h2>Movie theater</h2>
    <h3>Listing the seats</h3>

    <li class="test-seat" *ngFor="let item of list | async">
        {{ item.seat }}
    </li>
    <div style="clear:both"></div>

    <div class="movies" [ngClass]="{ animate: animate }">
        <div *ngFor="let row of rows" class="row" [ngClass]="{ animate : row.animate }">
            <div [title]="column.description" (click)="book(column)" [ngClass]="{ booked: column.booked, reserved : column.reserved }" *ngFor="let column of row.columns" class="column">
            <span class="seat">{{ column.seat }}</span>
            </div>
        </div>
        <div class="selected-seat">Latest selection : {{ selectedSeat?.description }}</div>
    </div>
  `,
  styleUrls: ['theater.component.css']
})
export class Theater{
    rows:Array<Row>;
    selectedSeat:Column;
    animate:boolean;
    list;

    constructor(public af:AngularFire){
        this.rows = new Array<Row>();

        setTimeout(() => {
            this.animate = true;
        },100);  

        for(var i=0; i< 10; i++) {
            this.rows.push( new Row(i + 1) );
        }

        this.initSeats();
    }

    private initSeats(){
        this.list = this.af.database.list('/seats');
        this.list.remove();
        for(var i=0; i< 10; i++) {
        this.list.push({ seat: i + 1 });
        }
    }

    book(column:Column) {
        this.selectedSeat = column;
        console.log('book', column.seat);
        if(column.booked) {
            column.booked = false;
            column.reserved;
        } else if(column.reserved) {
            column.booked = true;
            column.reserved = false;
        } else if(column.booked) {
            column.booked = false;
        } else {
            column.reserved = true;
        }
        
    }
}

class Row {
  columns:Array<Column>;
  animate:boolean;
  constructor(row:number){
    this.columns = new Array<Column>();
    for(var i=0; i< 10; i++) {
      this.columns.push( new Column( row + "-" + (i+ 1) ) );
    }

    setTimeout(() => {
        this.animate = true;
    }, 100 * row);
  }
}

class Column {
  booked:boolean;
  seat:string;
  reserved:boolean;

  constructor(seat){
    this.seat = seat;
    this.reserved = false;
    this.booked = false;
  }

  get description(){
      if(this.booked) return `Seat ${this.seat} is booked`
      else if(this.reserved) return `Seat ${this.seat} is reserved`
      else return `Seat ${this.seat} is available`
  }
}