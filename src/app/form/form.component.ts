import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import {moveItemInArray} from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  divisionsForCompany: any[] = [];
  medicianeName: any[] = [];
  medicianePower: any[] = [];
  selectedCompany: any;
  selectedDevision: any;
  selectedMediciane: any;
  MObNo: any[] = [];
  tab: any[] = [];
  selectCompanyName: any;
  selectDivisionName: string | undefined;
  selectMedicianeName: string | undefined;
  selectMedicianePower: any;
  isCompany: boolean = true;
  isDivision: boolean = true;
  isMediciane: boolean = true;
  isPower: boolean = true;
  isSubmit : boolean = true;
  Entry : any[] = [];
  selectedValue: string = '';
  divisionsCompany: any[] = [];
  MedicianeCompany: any[] = [];
  MedicianeForPower: any[] = [];
  selectedPowerValue: string = '';
  a: boolean = true;

  constructor(private modalservice: NgbModal, private config: NgbModalConfig, private toastr : ToastrService) {
    config.backdrop = 'static'
  }

  profile = new FormGroup({
    name: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]{10}$')]),
    Tab : new FormGroup({
      Company : new FormControl('', [Validators.required]),
      Division : new FormControl('', [Validators.required]),
      Mediciane : new FormControl('', [Validators.required]),
      Power : new FormControl('', [Validators.required])
    })
  })

  c = {
    "companies": [
      { "id": 1, "name": "MediLife Pharma" },
      { "id": 2, "name": "HealthCure Labs" }
    ],
    "divisions": [
      { "id": 1, "name": "Cardiology", "company_id": 1 },
      { "id": 2, "name": "Dermatology", "company_id": 1 },
      { "id": 3, "name": "Neurology", "company_id": 2 },
      { "id": 4, "name": "Oncology", "company_id": 2 }
    ],
    "medicines": [
      { "id": 1, "name": "CardioSafe", "division_id": 1 },
      { "id": 2, "name": "DermaGlow", "division_id": 2 },
      { "id": 3, "name": "NeuroPlus", "division_id": 3 },
      { "id": 4, "name": "OncoShield", "division_id": 4 }
    ],
    "powers": [
      { "id": 1, "name": "10mg", "value": "10mg", "medicine_id": 1 },
      { "id": 2, "name": "50mg", "value": "50mg", "medicine_id": 1 },
      { "id": 3, "name": "20mg", "value": "20mg", "medicine_id": 2 },
      { "id": 4, "name": "40mg", "value": "40mg", "medicine_id": 2 },
      { "id": 5, "name": "100mg", "value": "100mg", "medicine_id": 3 },
      { "id": 6, "name": "150mg", "value": "150mg", "medicine_id": 4 }
    ]
  }

  AddNumber() {
    if (this.mobileno?.valid) {
      this.MObNo.push(this.profile.value.mobile)
      this.profile.get('mobile')?.reset()
    }
  }

  DeleteNo(val: number) {
    this.MObNo.splice(val, 1)
  }

  DescriptionCompany(index : number, event : Event){
    var SelectValue = event.target as HTMLSelectElement;
    this.selectedValue = SelectValue.value;
    const obj = this.c.companies.find(item => (item.id).toString() === this.selectedValue)
    this.tab[index].Company = obj?.name
    this.divisionsCompany = this.c.divisions.filter(item => (item.company_id).toString() === this.selectedValue)
    this.MedicianeCompany = []
    this.MedicianeForPower = []
    this.tab[index].Division = ''
    this.tab[index].Mediciane = ''
    this.tab[index].Power = ''
    

    // console.log(divisionsCompany  )
    // // this.selectedCompany = this.profile.value.Tab?.Company
    // // this.divisionsForCompany = this.c.divisions.filter(item => (item.company_id).toString() === this.selectedCompany);
    // // this.medicianeName = [];
    // // this.medicianePower = [];
  }

  DescriptionDivision(index : number, event : Event){
    const selectDivisionValue = event.target as HTMLSelectElement
    const selectedDivisionValue = selectDivisionValue.value;
    const obj1 = this.c.divisions.find(item => (item.company_id).toString() === selectedDivisionValue)
    this.tab[index].Division = obj1?.name
    this.MedicianeCompany = this.c.medicines.filter(item => (item.division_id).toString() === selectedDivisionValue)
    this.MedicianeForPower = []
    this.tab[index].Mediciane = ''
    this.tab[index].Power = ''
  }

  DescriptionMediciane(index : number, event : Event){
    const selectMedicineValue = event.target as HTMLSelectElement
    const selectedMedicianeValue = selectMedicineValue.value;
    const obj2 = this.c.medicines.find(item => (item.division_id).toString() === selectedMedicianeValue)
    this.tab[index].Mediciane = obj2?.name
    this.MedicianeForPower = this.c.powers.filter(item => (item.medicine_id).toString() === selectedMedicianeValue)
    this.tab[index].Power = ''
  }

  DescriptionPower(index : number, event : Event){
    const selectPowerValue = event.target as HTMLSelectElement
    this.selectedPowerValue = selectPowerValue.value
    const obj3 = this.c.powers.find(item => (item.medicine_id).toString() === this.selectedPowerValue)
    this.tab[index].Power = obj3?.value
  }

  selectCompany() {
    this.selectedCompany = this.profile.value.Tab?.Company
    this.divisionsForCompany = this.c.divisions.filter(item => (item.company_id).toString() === this.selectedCompany);
    this.medicianeName = [];
    this.medicianePower = [];
  }

  selectDevision() {
    this.selectedDevision = this.profile.value.Tab?.Division
    this.medicianeName = this.c.medicines.filter(item => (item.division_id).toString() === this.selectedDevision)
    this.medicianePower = []
    this.profile.get('Tab.Mediciane')?.setValue('')
    this.profile.get('Tab.Power')?.setValue('')
  }

  selectMediciane() {
    this.selectedMediciane = this.profile.value.Tab?.Mediciane
    this.medicianePower = this.c.powers.filter(item => (item.medicine_id).toString() === this.selectedMediciane)
    this.profile.get('Tab.Power')?.setValue('')
  }

  get name() {
    return this.profile.get('name');
  }

  get dob() {
    return this.profile.get('dob');
  }

  get mobileno() {
    return this.profile.get('mobile');
  }

  AddMediciane() {
    let isValid = true
    this.isCompany = true
    this.isDivision = true
    this.isMediciane = true
    this.isPower = true

    this.selectedCompany = this.profile.value.Tab?.Company;
    this.selectedDevision = this.profile.value.Tab?.Division;
    this.selectedMediciane = this.profile.value.Tab?.Mediciane;
    if (this.selectedCompany == '') {
      isValid = false
      this.isCompany = false
    }

    if (this.selectedDevision == '') {
      isValid = false;
      this.isDivision = false
    }

    if (this.selectedMediciane == '') {
      isValid = false
      this.isMediciane = false;
    }

    if (this.profile.value.Tab?.Power == '') {
      isValid = false;
      this.isPower = false
    }

    if (isValid == true) {

      this.selectCompanyName = this.c.companies.find(x => x.id.toString() === this.selectedCompany)?.name
      this.selectDivisionName = this.c.divisions.find(x => x.id.toString() === this.selectedDevision)?.name
      this.selectMedicianeName = this.c.medicines.find(x => x.id.toString() === this.selectedMediciane)?.name
      this.selectMedicianePower = this.profile.value.Tab?.Power

      var prescription = {
        Company: this.selectCompanyName,
        Division: this.selectDivisionName,
        Mediciane: this.selectMedicianeName,
        Power: this.selectMedicianePower
      }

      const alreadyExists = this.tab.some(item =>
        item.Company === prescription.Company &&
        item.Division === prescription.Division &&
        item.Mediciane === prescription.Mediciane &&
        item.Power === prescription.Power
      );

      if (!alreadyExists || this.tab.length == 0) {
        this.tab.push(prescription)
        this.profile.get('Tab.Company')?.setValue('')
        this.profile.get('Tab.Division')?.setValue('')
        this.profile.get('Tab.Mediciane')?.setValue('')
        this.profile.get('Tab.Power')?.setValue('')
        this.divisionsForCompany = [];
        this.medicianeName = [];
        this.medicianePower = []
      }
      else{
        this.toastr.warning('Prescription are not same', 'Validation')
      }
    }
  }

  dropMobile(event : CdkDragDrop<any[]>){
    moveItemInArray(this.MObNo, event.previousIndex, event.currentIndex)
    this.MObNo = [...this.MObNo]
  }
  drop(event : CdkDragDrop<any[]>){
    moveItemInArray(this.tab, event.previousIndex, event.currentIndex)
    this.tab = [...this.tab]
  }

  DeleteEntry(index: number) {
    this.tab.splice(index, 1)
  }

  CloseModel() {
    this.modalservice.dismissAll()
  }

  onSubmit() {
    if(this.tab.length != 0 && this.MObNo.length != 0 && this.profile.value.name && this.profile.value.dob){
      let patient = {
        Name : this.profile.value.name,
        dob : this.profile.value.dob,
        mobileNo : this.MObNo,
        Prescription : this.tab
      } 
      this.Entry.push(patient);
      this.profile.markAsTouched();
      console.log(this.Entry)
    }
  }
}
