import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
  divisionsCompany: any[][] = [];
  MedicianeCompany: any[][] = [];
  MedicianeForPower: any[][] = [];
  selectedPowerValue: string | null | undefined;
  selectedCompanyName: string = '';
  selectedDivisionName: string = '';
  selectedMedicianeName: string = '';
  constructor(private activeModal: NgbActiveModal, private toastr: ToastrService) { }

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
    companies: [
      { id: 1, name: 'MediLife Pharma' },
      { id: 2, name: 'HealthCure Labs' }
    ],
    divisions: [
      { id: 1, name: 'Cardiology', company_id: 1 },
      { id: 2, name: 'Dermatology', company_id: 1 },
      { id: 3, name: 'Neurology', company_id: 2 },
      { id: 4, name: 'Oncology', company_id: 2 }
    ],
    medicines: [
      { id: 1, name: 'CardioSafe', division_id: 1 },
      { id: 2, name: 'DermaGlow', division_id: 2 },
      { id: 3, name: 'NeuroPlus', division_id: 3 },
      { id: 4, name: 'OncoShield', division_id: 4 }
    ],
    powers: [
      { id: 1, name: '10mg', value: '10mg', medicine_id: 1 },
      { id: 2, name: '50mg', value: '50mg', medicine_id: 1 },
      { id: 3, name: '20mg', value: '20mg', medicine_id: 2 },
      { id: 4, name: '40mg', value: '40mg', medicine_id: 2 },
      { id: 5, name: '100mg', value: '100mg', medicine_id: 3 },
      { id: 6, name: '150mg', value: '150mg', medicine_id: 4 }
    ]
  };

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

  AddNumber() {
    if (this.mobileno?.valid) {
      this.MObNo.push(this.profile.value.mobile)
      this.profile.get('mobile')?.reset()
    }
  }

  dropMobile(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.MObNo, event.previousIndex, event.currentIndex)
    this.MObNo = [...this.MObNo]
  }

  DeleteNo(val: number) {
    this.MObNo.splice(val, 1)
  }

  selectCompany() {
    this.selectedCompanyId = this.profile.get('Tab.Company')?.value
    this.divisionsWithCompany = this.c.divisions.filter(item => (item.company_id).toString() === this.selectedCompanyId);
    this.profile.get('Tab.Division')?.setValue('');
    this.profile.get('Tab.Mediciane')?.setValue('');
    this.profile.get('Tab.Power')?.setValue('');
    this.medicianesWithDivision = [];
    this.PowerWithMedicianes = []
    // this.divisionsWithCompany = this.getAvailableDivisionsForTab();
  }

  selectDevision() {
    this.selectedDevisionId = this.profile.get('Tab.Division')?.value;
    this.medicianesWithDivision = this.c.medicines.filter(item => (item.division_id).toString() === this.selectedDevisionId)
    this.PowerWithMedicianes = []
    this.profile.get('Tab.Mediciane')?.setValue('')
    this.profile.get('Tab.Power')?.setValue('')
    // this.medicianesWithDivision = this.getAvailableMedicinesForTab();
  }

  selectMediciane() {
    this.selectedMedicianeId = this.profile.get('Tab.Mediciane')?.value;
    this.PowerWithMedicianes = this.c.powers.filter(item => (item.medicine_id).toString() === this.selectedMedicianeId)
    this.profile.get('Tab.Power')?.setValue('');
    // this.PowerWithMedicianes = this.getAvailablePowersForTab();
  }

  selectPower() {
    this.selectedPowerValue = this.profile.get('Tab.Power')?.value;
  }

  AddMediciane() {
    let isValid = true;
    this.isCompany = true;
    this.isDivision = true;
    this.isMediciane = true;
    this.isPower = true;

    // this.selectedCompanyId = this.profile.get('Tab.Company')?.value;
    // this.selectedDevisionId = this.profile.get('Tab.Division')?.value;
    // this.selectedMedicianeId = this.profile.get('Tab.Mediciane')?.value;
    this.selectedPowerValue = this.profile.get('Tab.Power')?.value;

    if (!this.selectedCompanyId) {
      isValid = false;
      this.isCompany = false;
    }
    if (!this.selectedDevisionId) {
      isValid = false;
      this.isDivision = false;
    }
    if (!this.selectedMedicianeId) {
      isValid = false;
      this.isMediciane = false;
    }
    if (!this.selectedPowerValue) {
      isValid = false;
      this.isPower = false;
    }

    if (isValid == true) {
      const CompanyName = this.c.companies.find(x => x.id.toString() === this.selectedCompanyId)?.name
      const DivisionName = this.c.divisions.find(x => x.id.toString() === this.selectedDevisionId)?.name
      const MedicianeName = this.c.medicines.find(x => x.id.toString() === this.selectedMedicianeId)?.name
      const MedicianePower = this.selectedPowerValue

      const alreadyExists = this.tab.controls.some(item =>
        item.get('company')?.value === CompanyName &&
        item.get('division')?.value === DivisionName &&
        item.get('mediciane')?.value === MedicianeName &&
        item.get('power')?.value === MedicianePower
      );

      // this.divisionsCompany = this.c.divisions.filter(X => X.company_id.toString() === this.selectedCompanyId)
      // this.MedicianeCompany = this.c.medicines.filter(X => X.division_id.toString() === this.selectedDevisionId)
      // this.MedicianeForPower = this.c.powers.filter(X => X.medicine_id.toString() === this.selectedMedicianeId)

      if (!alreadyExists || this.tab.length === 0) {
        const newIndex = this.tab.length;
        this.tab.push(new FormGroup({
          company: new FormControl(CompanyName, Validators.required),
          division: new FormControl(DivisionName, Validators.required),
          mediciane: new FormControl(MedicianeName, Validators.required),
          power: new FormControl(MedicianePower, Validators.required)
        }))
        this.divisionsCompany[newIndex] = [];
        this.MedicianeCompany[newIndex] = [];
        this.MedicianeForPower[newIndex] = [];
        this.profile.get('Tab')?.reset();
        this.profile.get('Tab.Company')?.setValue('')
        this.divisionsWithCompany = [];
        this.medicianesWithDivision = [];
        this.PowerWithMedicianes = [];

        //    this.tab.push(profile)
        //    const profile = new FormGroup({
        //      company: new FormControl(CompanyName),
        //      division: new FormControl(DivisionName),
        //      mediciane: new FormControl(MedicianeName),
        //      power: new FormControl(MedicianePower),
        //      divisionsCompany: new FormControl([]),
        //      MedicianeCompany: new FormControl([]),
        //      MedicianeForPower: new FormControl([])
        //    })
      } else {
        this.toastr.warning('Prescription already exists', 'Validation');
      }
    }
  }

  getAvailableCompanies(index: number): any[] {
    // const selectedCompanies = this.tab.controls
    // console.log(selectedCompanies)
    // const selectedCompanies = this.tab.controls.filter((_, i) => i !== index).map(item => item.get('company')?.value);
    // const currentCompany = this.tab.at(index).get('company')?.value;
    // const currentCompany = index >= 0 ? this.tab.at(index).get('company')?.value : '';
    return this.c.companies
    // return this.c.companies.filter(company => !selectedCompanies.includes(company.name) || company.name === currentCompany);
  }

  getAvailableDivisions(index: number, companyName: string): any[] {
    const company = this.c.companies.find(c => c.name === companyName);
    // if (!company) return [];
    // const selectedDivisions = this.tab.controls.filter((i) => index).map(item => item.get('division')?.value);
    // // const selectedDivisions = this.tab.controls.filter((_, i) => i !== index).map(item => item.get('division')?.value);
    // const currentDivision = this.tab.at(index).get('division')?.value;
    // // const currentDivision = index >= 0 ? this.tab.at(index).get('division')?.value : '';
    // const company = this.c.companies.find(item => item.name === this.selectedCompanyName)

    return this.c.divisions.filter(item => item.company_id === company?.id)
    // return this.c.divisions.filter(div => div.company_id === company.id && (!selectedDivisions.includes(div.name) || div.name === currentDivision));
  }

  getAvailableMedicines(index: number, divisionName: string): any[] {
    const division = this.c.divisions.find(item => item.name === divisionName)
    // const division = this.c.divisions.find(d => d.name === divisionName);
    // console.log(division)
    //   if (!division) return [];
    //   const selectedMedicines = this.tab.controls
    //     .filter((_, i) => i !== index)
    //     .map(item => item.get('mediciane')?.value);
    //   const currentMedicine = index >= 0 ? this.tab.at(index).get('mediciane')?.value : '';
    return this.c.medicines.filter(item => item.division_id === division?.id)
    //     .filter(med => med.division_id === division.id && (!selectedMedicines.includes(med.name) || med.name === currentMedicine));
  }

  getAvailablePowers(index: number, medicineName: string): any[] {
    const mediciane = this.c.medicines.find(item => item.name === medicineName)
    //   const medicine = this.c.medicines.find(m => m.name === medicineName);
    //   if (!medicine) return [];
    //   const selectedPowers = this.tab.controls
    //     .filter((_, i) => i !== index)
    //     .map(item => item.get('power')?.value);
    //   const currentPower = index >= 0 ? this.tab.at(index).get('power')?.value : '';
    return this.c.powers.filter(item => item.medicine_id === mediciane?.id)
    //   return this.c.powers
    //     .filter(power => power.medicine_id === medicine.id && (!selectedPowers.includes(power.value) || power.value === currentPower));
  }

  DescriptionCompany(index: number, event: Event) {
    this.selectedCompanyName = (event.target as HTMLSelectElement).value;
    if (this.selectedCompanyName != '') {
      this.tab.at(index).get('Company')?.setValue(this.selectedCompanyName)
    }
    const company = this.c.companies.find(item => item.name === this.selectedCompanyName)
    if (company) {
      this.divisionsCompany = this.c.divisions.filter(item => item.company_id === company.id).map(item => [item.id, item.name, item.company_id]);
    } else {
      this.divisionsCompany = []
    }
    this.tab.at(index).patchValue({
      // company: this.c.companies.find(X => X.id.toString() === selectedValue)?.name,
      division: '',
      mediciane: '',
      power: ''
      // divisionsCompany: this.divisionsCompany,
      // MedicianeCompany: [],
      // MedicianeForPower: []
    })
    //   const obj = this.c.companies.find(item => (item.id).toString() === selectedCompanyName)
    //   this.tab.at(index).get('company')?.setValue(obj?.name)
    // }
    //     this.divisionsCompany = this.c.divisions.filter(item => (item.company_id).toString() === selectedValue)

    // this.divisionsCompany[index] = company ? this.c.divisions.filter(item => item.company_id === company.id) : [];
    // // // Exclude divisions selected in other rows
    // const selectedDivisions = this.tab.controls.filter((_, i) => i !== index).map(item => item.get('division')?.value);
    // this.divisionsCompany[index] = this.divisionsCompany[index].filter(div => !selectedDivisions.includes(div.name));
    // this.MedicianeCompany[index] = [];
    // this.MedicianeForPower[index] = [];
  }

  DescriptionDivision(index: number, event: Event) {
    this.selectedDivisionName = (event.target as HTMLSelectElement).value
    if (this.selectedDivisionName != "") {
      this.tab.at(index).get('Division')?.setValue(this.selectedDivisionName)
    }
    const division = this.c.divisions.find(item => item.name === this.selectedDivisionName)
    if (division) {
      this.MedicianeCompany = this.c.medicines.filter(item => item.division_id === division.id).map(item => [item.id, item.name, item.division_id])
    } else {
      this.MedicianeCompany = []
    }
    this.tab.at(index).patchValue({
      // division: this.c.divisions.find(X => X.id.toString() === selectedDivisionValue)?.name,
      mediciane: '',
      power: ''
      // MedicianeCompany: medicianes,
      // MedicianeForPower: []
    })

    // // Exclude medicines selected in other rows
    // const selectedMedicines = this.tab.controls
    //   .filter((_, i) => i !== index)
    //   .map(item => item.get('mediciane')?.value);
    // this.MedicianeCompany[index] = this.MedicianeCompany[index].filter(med => !selectedMedicines.includes(med.name));
    // this.MedicianeForPower[index] = [];
  }

  DescriptionMediciane(index: number, event: Event) {
    this.selectedMedicianeName = (event.target as HTMLSelectElement).value;
    if (this.selectedMedicianeName != "") {
      this.tab.at(index).get('mediciane')?.setValue(this.selectedMedicianeName)
    }
    const mediciane = this.c.medicines.find(item => item.name === this.selectedMedicianeName)
    if (mediciane) {
      this.MedicianeForPower = this.c.powers.filter(item => item.medicine_id === mediciane.id).map(item => [item.id, item.name, item.value, item.medicine_id])
    }
    else {
      this.MedicianeForPower = []
    }
    this.tab.at(index).patchValue({
      // mediciane: this.c.medicines.find(x => x.division_id.toString() === selectedMedicianeValue)?.name,
      power: ''
      // MedicianeForPower: powers
    })

    // // Exclude powers selected in other rows
    // const selectedPowers = this.tab.controls
    //   .filter((_, i) => i !== index)
    //   .map(item => item.get('power')?.value);
    // this.MedicianeForPower[index] = this.MedicianeForPower[index].filter(power => !selectedPowers.includes(power.value));
  }

  DescriptionPower(index: number, event: Event) {
    const selectedPowerValue = (event.target as HTMLSelectElement).value
    if(selectedPowerValue){
      this.tab.at(index).get('power')?.setValue(selectedPowerValue)
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    const controls = this.tab.controls
    moveItemInArray(controls, event.previousIndex, event.currentIndex)
    // Update dropdown options arrays to match new order
    // const divisionsCompany = [...this.divisionsCompany];
    // const MedicianeCompany = [...this.MedicianeCompany];
    // const MedicianeForPower = [...this.MedicianeForPower];
    // this.divisionsCompany = [];
    // this.MedicianeCompany = [];
    // this.MedicianeForPower = [];
    // for (let i = 0; i < controls.length; i++) {
    //   this.divisionsCompany[i] = divisionsCompany[event.currentIndex === i ? event.previousIndex : event.currentIndex === i ? event.previousIndex : i] || [];
    //   this.MedicianeCompany[i] = MedicianeCompany[event.currentIndex === i ? event.previousIndex : event.currentIndex === i ? event.previousIndex : i] || [];
    //   this.MedicianeForPower[i] = MedicianeForPower[event.currentIndex === i ? event.previousIndex : event.currentIndex === i ? event.previousIndex : i] || [];
  }

  DeleteEntry(index: number) {
    this.tab.removeAt(index);
    // this.divisionsCompany.splice(index, 1);
    // this.MedicianeCompany.splice(index, 1);
    // this.MedicianeForPower.splice(index, 1);
  }

  CloseModel() {
    this.activeModal.close();
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
      console.log(this.Entry);
      // this.profile.markAsTouched();
    };
  }

  getAvailableDivisionsForTab() {
    // getAvailableDivisionsForTab(): any[] {
    // const companyId = this.profile.get('Tab.Company')?.value;
    // const company = this.c.companies.find(c => c.id.toString() === companyId);
    // if (!company) return [];
    // const selectedDivisions = this.tab.controls.map(item => item.get('division')?.value);
    // return this.c.divisions.filter(div => div.company_id === company.id && !selectedDivisions.includes(div.name));
  }

  getAvailableMedicinesForTab() {
    // getAvailableMedicinesForTab(): any[] {
    //   const divisionId = this.profile.get('Tab.Division')?.value;
    //   const division = this.c.divisions.find(d => d.id.toString() === divisionId);
    //   if (!division) return [];
    //   const selectedMedicines = this.tab.controls.map(item => item.get('mediciane')?.value);
    //   return this.c.medicines.filter(med => med.division_id === division.id && !selectedMedicines.includes(med.name));
  }

  getAvailablePowersForTab() {
    // getAvailablePowersForTab(): any[] {
    //   const medicineId = this.profile.get('Tab.Mediciane')?.value;
    //   const medicine = this.c.medicines.find(m => m.id.toString() === medicineId);
    //   if (!medicine) return [];
    //   const selectedPowers = this.tab.controls.map(item => item.get('power')?.value);
    //   return this.c.powers.filter(power => power.medicine_id === medicine.id && !selectedPowers.includes(power.value));
  }
}