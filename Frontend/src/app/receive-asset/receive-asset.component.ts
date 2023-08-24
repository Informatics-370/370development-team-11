import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Procurement_Status } from '../Shared/ProcurementStatus';

@Component({
  selector: 'app-receive-asset',
  templateUrl: './receive-asset.component.html',
  styleUrls: ['./receive-asset.component.css']
})
export class ReceiveAssetComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private dataService: DataService, private router: Router, private sanitizer: DomSanitizer) { }
  myForm: FormGroup = new FormGroup({});
  Statuses: Procurement_Status[] = [];
  id: Number = 0;
  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.dataService.GetAssetStatuses().subscribe({
      next: (result) => {
        this.Statuses = result;
      }
    })



    this.myForm = this.formBuilder.group({
      Status: ['', [Validators.required]]
    })
  }

  onSubmit() {
    let StatusID = this.myForm.get("Status")?.value;
    console.log(StatusID)
    document.getElementById('AnimationBtn').classList.toggle("is_active");
    document.getElementById('cBtn').style.display = "none";
    this.dataService.UpdateProcurementStatus(StatusID, this.id).subscribe({
      next: (Result) => {
        this.router.navigate(['/ViewProcurementDetails'])
      }
    })
  }
  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewProcurementDetails']);
  }
}
