import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private modalService: NgbModal) { }

  title = 'Mediciane-Form';

  openVerticallyCentered() {
    this.modalService.open(FormComponent, {
      size: 'xl',
      backdrop: 'static'
    })
  }
}
