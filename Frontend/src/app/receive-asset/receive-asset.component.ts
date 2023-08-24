import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Procurement_Status } from '../Shared/ProcurementStatus';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';

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

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }


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
    let SelectedStatus = this.Statuses.findIndex(x => x.procurement_Status_ID == StatusID)
    console.log(StatusID)
    this.dataService.UpdateProcurementStatus(StatusID, this.id).subscribe({
      next: (Result) => {
        this.log.action = "Changed Asset Status To: " + this.Statuses[Number(SelectedStatus)].name;
        this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
        let test: any
        test = new DatePipe('en-ZA');
        this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
        this.dataService.AuditLogAdd(this.log).subscribe()
        this.router.navigate(['/ViewProcurementDetails'])
      }
    })
  }
  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewProcurementDetails']);
  }
}
