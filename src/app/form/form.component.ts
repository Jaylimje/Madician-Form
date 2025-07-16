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
    if (this.selectedCompanyId) { this.isCompany = true }
    else { this.isCompany = false }
  }

  selectDevision() {
    this.selectedDevisionId = this.profile.get('Tab.Division')?.value;
    this.medicianesWithDivision = this.c.medicines.filter(item => (item.division_id).toString() === this.selectedDevisionId)
    this.PowerWithMedicianes = []
    this.profile.get('Tab.Mediciane')?.setValue('')
    this.profile.get('Tab.Power')?.setValue('')
    if (this.selectedDevisionId) { this.isDivision = true; }
    else {
      this.isDivision = false;
      this.isMediciane = false;
      this.isPower = false
    }
  }

  selectMediciane() {
    this.selectedMedicianeId = this.profile.get('Tab.Mediciane')?.value;
    this.PowerWithMedicianes = this.c.powers.filter(item => (item.medicine_id).toString() === this.selectedMedicianeId)
    this.profile.get('Tab.Power')?.setValue('');
    if (this.selectedMedicianeId) this.isMediciane = true;
    else {
      this.isMediciane = false;
      this.isPower = false;
    }
  }

  selectPower() {
    this.selectedPowerValue = this.profile.get('Tab.Power')?.value;
    if (this.selectedPowerValue) this.isPower = true;
    else this.isPower = false
  }

  AddMediciane() {
    let isValid = true;
    this.isCompany = true;
    this.isDivision = true;
    this.isMediciane = true;
    this.isPower = true;

    this.selectedCompanyId = this.profile.get('Tab.Company')?.value
    this.selectedDevisionId = this.profile.get('Tab.Division')?.value
    this.selectedMedicianeId = this.profile.get('Tab.Mediciane')?.value
    this.selectedPowerValue = this.profile.get('Tab.Power')?.value

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

      const alreadyExists = this.tab.controls.some(item =>
        item.get('company')?.value === CompanyName &&
        item.get('division')?.value === DivisionName &&
        item.get('mediciane')?.value === MedicianeName &&
        item.get('power')?.value === this.selectedPowerValue
      );

      if (!alreadyExists || this.tab.length === 0) {
        const newIndex = this.tab.length;
        this.tab.push(new FormGroup({
          company: new FormControl(CompanyName, Validators.required),
          division: new FormControl(DivisionName, Validators.required),
          mediciane: new FormControl(MedicianeName, Validators.required),
          power: new FormControl(this.selectedPowerValue, Validators.required)
        }))

        this.divisionsCompany[newIndex] = [];
        this.MedicianeCompany[newIndex] = [];
        this.MedicianeForPower[newIndex] = [];
        this.profile.get('Tab')?.reset();
        this.profile.get('Tab.Company')?.setValue('')
        this.divisionsWithCompany = [];
        this.medicianesWithDivision = [];
        this.PowerWithMedicianes = [];
      } else {
        this.toastr.warning('Prescription already exists', 'Validation');
      }
    }
  }

  getAvailableCompanies(index: number): any[] {
    return this.c.companies
  }

  getAvailableDivisions(index: number, companyName: string): any[] {
    const company = this.c.companies.find(c => c.name === companyName);
    return this.c.divisions.filter(item => item.company_id === company?.id)
  }

  getAvailableMedicines(index: number, divisionName: string): any[] {
    const division = this.c.divisions.find(item => item.name === divisionName)
    return this.c.medicines.filter(item => item.division_id === division?.id)
  }

  getAvailablePowers(index: number, medicineName: string): any[] {
    const mediciane = this.c.medicines.find(item => item.name === medicineName)
    return this.c.powers.filter(item => item.medicine_id === mediciane?.id)
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
      division: '',
      mediciane: '',
      power: ''
    })
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
      mediciane: '',
      power: ''
    })
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
      power: ''
    })
  }

  DescriptionPower(index: number, event: Event) {
    const selectedPowerValue = (event.target as HTMLSelectElement).value
    if (selectedPowerValue) {
      this.tab.at(index).get('power')?.setValue(selectedPowerValue)
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    const controls = this.tab.controls
    moveItemInArray(controls, event.previousIndex, event.currentIndex)
    moveItemInArray(this.divisionsCompany, event.previousIndex, event.currentIndex);
    moveItemInArray(this.MedicianeCompany, event.previousIndex, event.currentIndex);
    moveItemInArray(this.MedicianeForPower, event.previousIndex, event.currentIndex)
    this.tab.setValue(controls.map(ctrl => ctrl.value))
  }

  DeleteEntry(index: number) {
    this.tab.removeAt(index);
  }

  CloseModel() {
    this.activeModal.close();
  }

  onSubmit() {
    if (this.tab.length != 0 && this.MObNo.length != 0 && this.profile.value.name && this.profile.value.dob) {
      const prescription = this.tab.controls.map(ctrl => {
        const companyN = ctrl.get('company')?.value;
        const divisionN = ctrl.get('division')?.value;
        const medicianeN = ctrl.get('mediciane')?.value;
        const powerN = ctrl.get('power')?.value;

        return {
          company: this.c.companies.find(c => c.name === companyN)?.id,
          division: this.c.divisions.find(d => d.name === divisionN)?.id,
          mediciane: this.c.medicines.find(m => m.name === medicianeN)?.id,
          power: this.c.powers.find(p => p.name === powerN)?.id
        }
      })
      let patient = {
        Name: this.profile.value.name,
        dob: this.profile.value.dob,
        mobileNo: this.MObNo,
        Prescription: prescription
      }
      console.log(patient);
      this.activeModal.close()
      this.toastr.success("Form submitted successfully", 'Success')
    }
    else {
      this.toastr.error('Please fill all required fields', 'validation error')
      this.profile.markAllAsTouched()
    }
  }
}