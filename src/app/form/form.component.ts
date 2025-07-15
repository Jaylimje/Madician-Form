import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  divisionsWithCompany: any[] = [];
  medicianesWithDivision: any[] = [];
  PowerWithMedicianes: any[] = [];
  selectedCompanyId: any = '';
  selectedDevisionId: any = '';
  selectedMedicianeId: any = '';
  MObNo: any[] = [];
  isCompany: boolean = true;
  isDivision: boolean = true;
  isMediciane: boolean = true;
  isPower: boolean = true;
  Entry: any[] = [];
  divisionsCompany: any[] = [];
  MedicianeCompany: any[] = [];
  MedicianeForPower: any[] = [];
  selectedPowerValue: string = '';

  constructor(private activeModel: NgbActiveModal, private toastr: ToastrService) {}
  
  Onchange(){
    this.tab.valueChanges.subscribe(item => item.tab.division = [])
  }

  OnInit(){
    this.Onchange()
  }

  profile = new FormGroup({
    name: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]{10}$')]),
    Tab: new FormGroup({
      Company: new FormControl('', [Validators.required]),
      Division: new FormControl('', [Validators.required]),
      Mediciane: new FormControl('', [Validators.required]),
      Power: new FormControl('', [Validators.required])
    }),
    tab: new FormArray([])
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

  getFormControl(group: AbstractControl, controlName: string): FormControl {
    return group.get(controlName) as FormControl;
  }

  DescriptionCompany(index: number, event: Event) {
    var selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue != "") {
      const obj = this.c.companies.find(item => (item.id).toString() === selectedValue)
      this.tab.at(index).get('company')?.setValue(obj?.name)
    }
    this.divisionsCompany = this.c.divisions.filter(item => (item.company_id).toString() === selectedValue)

    this.tab.at(index).patchValue({
      company: this.c.companies.find(X => X.id.toString() === selectedValue)?.name,
      division: '',
      mediciane: '',
      power: '',
      divisionsCompany: this.divisionsCompany,
      MedicianeCompany: [],
      MedicianeForPower: []
    })
  }

  DescriptionDivision(index: number, event: Event) {
    var selectedDivisionValue = (event.target as HTMLSelectElement).value
    if (selectedDivisionValue != "") {
      const obj = this.c.divisions.find(item => (item.company_id).toString() === selectedDivisionValue)
      this.tab.at(index).get('division')?.setValue(obj?.name)
    }
    const medicianes = this.c.medicines.filter(x => x.division_id.toString() === selectedDivisionValue)
    this.tab.at(index).patchValue({
      division: this.c.divisions.find(X => X.id.toString() === selectedDivisionValue)?.name,
      mediciane: '',
      power: '',
      MedicianeCompany: medicianes,
      MedicianeForPower: []
    })
  }

  DescriptionMediciane(index: number, event: Event) {
    const selectedMedicianeValue = (event.target as HTMLSelectElement).value
    const powers = this.c.powers.filter(x => x.medicine_id.toString() === selectedMedicianeValue)
    if (selectedMedicianeValue != "") {
      const obj = this.c.medicines.find(item => (item.id).toString() === selectedMedicianeValue)
      this.tab.at(index).get('mediciane')?.setValue(obj?.name)
    }
    this.tab.at(index).patchValue({
      mediciane: this.c.medicines.find(x => x.division_id.toString() === selectedMedicianeValue)?.name,
      power: '',
      MedicianeForPower: powers
    })
  }

  DescriptionPower(index: number, event: Event) {
    const selectedPowerValue = (event.target as HTMLSelectElement).value
    const selectedPower = this.c.powers.find(x => x.id.toString() === selectedPowerValue)
    this.tab.at(index).patchValue({
      power: selectedPower?.value
    })
  }

  selectCompany() {
    this.selectedCompanyId = this.profile.value.Tab?.Company
    this.divisionsWithCompany = this.c.divisions.filter(item => (item.company_id).toString() === this.selectedCompanyId);
    this.medicianesWithDivision = [];
    this.PowerWithMedicianes = []
  }

  selectDevision() {
    this.selectedDevisionId = this.profile.value.Tab?.Division
    this.medicianesWithDivision = this.c.medicines.filter(item => (item.division_id).toString() === this.selectedDevisionId)
    this.PowerWithMedicianes = []
    this.profile.get('Tab.Mediciane')?.setValue('')
    this.profile.get('Tab.Power')?.setValue('')
  }

  selectMediciane() {
    this.selectedMedicianeId = this.profile.value.Tab?.Mediciane
    this.PowerWithMedicianes = this.c.powers.filter(item => (item.medicine_id).toString() === this.selectedMedicianeId)
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

  get tab() {
    return this.profile.get('tab') as FormArray
  }

  AddMediciane() {
    let isValid = true
    this.isCompany = true
    this.isDivision = true
    this.isMediciane = true
    this.isPower = true

    if (this.selectedCompanyId == '') {
      isValid = false
      this.isCompany = false
    }

    if (this.selectedDevisionId == '') {
      isValid = false;
      this.isDivision = false
    }

    if (this.selectedMedicianeId == '') {
      isValid = false
      this.isMediciane = false;
    }

    if (this.profile.value.Tab?.Power == '') {
      isValid = false;
      this.isPower = false
    }

    if (isValid == true) {
      const CompanyName = this.c.companies.find(x => x.id.toString() === this.selectedCompanyId)?.name
      const DivisionName = this.c.divisions.find(x => x.id.toString() === this.selectedDevisionId)?.name
      const MedicianeName = this.c.medicines.find(x => x.id.toString() === this.selectedMedicianeId)?.name
      const MedicianePower = this.profile.value.Tab?.Power

      const alreadyExists = this.tab.controls.some(item =>
        item.get('company')?.value === CompanyName &&
        item.get('division')?.value === DivisionName &&
        item.get('mediciane')?.value === MedicianeName &&
        item.get('power')?.value === MedicianePower
      );

      this.divisionsCompany = this.c.divisions.filter(X => X.company_id.toString() === this.selectedCompanyId)
      this.MedicianeCompany = this.c.medicines.filter(X => X.division_id.toString() === this.selectedDevisionId)
      this.MedicianeForPower = this.c.powers.filter(X => X.medicine_id.toString() === this.selectedMedicianeId)

      if (!alreadyExists || this.tab.length == 0) {
        const profile = new FormGroup({
          company: new FormControl(CompanyName),
          division: new FormControl(DivisionName),
          mediciane: new FormControl(MedicianeName),
          power: new FormControl(MedicianePower),
          divisionsCompany: new FormControl([]),
          MedicianeCompany: new FormControl([]),
          MedicianeForPower: new FormControl([])
        })
        this.tab.push(profile)
        this.profile.get('Tab.Company')?.setValue('')
        this.profile.get('Tab.Division')?.setValue('')
        this.profile.get('Tab.Mediciane')?.setValue('')
        this.profile.get('Tab.Power')?.setValue('')
        this.divisionsWithCompany = [];
        this.medicianesWithDivision = [];
        this.PowerWithMedicianes = []
      }
      else {
        this.toastr.warning('Prescription are not same', 'Validation')
      }
    }
  }

  dropMobile(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.MObNo, event.previousIndex, event.currentIndex)
    this.MObNo = [...this.MObNo]
  }

  drop(event: CdkDragDrop<any[]>) {
    const controls = this.tab.controls
    moveItemInArray(controls, event.previousIndex, event.currentIndex)
  }

  DeleteEntry(index: number) {
    this.tab.removeAt(index)
  }

  CloseModel() {
    this.activeModel.close();
  }

  onSubmit() {
    if (this.tab.length != 0 && this.MObNo.length != 0 && this.profile.value.name && this.profile.value.dob) {
      let patient = {
        Name: this.profile.value.name,
        dob: this.profile.value.dob,
        mobileNo: this.MObNo,
        Prescription: this.tab.value
      }
      this.Entry.push(patient);
      // this.profile.markAsTouched();
      console.log(this.Entry)
    }
  }
}