import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorDetails } from 'src/app/Shared/VendorDetails';
import { VendorCreateChoiceComponent } from '../vendor-create-choice/vendor-create-choice.component';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-vendor-view',
  templateUrl: './vendor-view.component.html',
  styleUrls: ['./vendor-view.component.css'],
})
export class VendorViewComponent implements OnInit  {
  
//,'Category'
  constructor(private VendorService: DataService, private dialog: MatDialog) { }

  VenDetails: VendorDetails[] = [];

  ngOnInit(): void {
    
   this.VendorService.GetAllVendorDetails().subscribe((result) => {
    let VendorDetails:any[] = result 
    VendorDetails.forEach(element => this.VenDetails.push(element))
    console.log(VendorDetails)
   })
    

  }//ngoninIt

  CreateApprovedVendor() {
    const confirm = this.dialog.open(VendorCreateChoiceComponent, {
      disableClose: true,
    });
  }
  displayedColumns : string[] = ["name", "Email","Telephone","View"];
}
