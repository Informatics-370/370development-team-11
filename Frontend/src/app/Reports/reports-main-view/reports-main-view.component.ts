import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';

import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reports-main-view',
  templateUrl: './reports-main-view.component.html',
  styleUrls: ['./reports-main-view.component.css']
})
export class ReportsMainViewComponent {

  constructor(private ReportService: DataService, private dialog:MatDialog,private router:Router) { }

  ApprovedVendorDetails:VendorOnboardRequest[] = [];




  GenerateApprovedReport() {
    this.ReportService.getAllApprovedVendors(2).subscribe(result => {
      this.ApprovedVendorDetails = result;
      const docDefinition = {
        content: [{text:'Approved Vendor',fontSize: 20,alignment: 'center',color: '#ffffff',background:'#002060',margin: [0, 0 ,0, 15]},
          {
          table: {headerRows: 0,
          widths: ['*','auto'],
          body:[["Name", "Email"],
          ...this.ApprovedVendorDetails.map(p => ([p.name, p.email])),
          ],
          layout: {
            hLineWidth: function (i, node) {
              if (i === 0 || i === node.table.body.length || i === 1) {
                
                return 1;
              }
              else {
                return 0;
              }
              
            },
            vLineWidth: function (i) {
              if (i === 0 || i === 2) {
                return 1;
              }
              else {
                return 0
              }
              
            },
            hLineColor: function (i) {
                return i ? 'black' : '#000000'
         
            },
            vLineColor: function (i) {
                return i ? 'black' : '#000000'
            },
            
          },
          margin:[0,0,0,15],
        },
      }] 
      };
     
      pdfMake.createPdf(docDefinition).open();
      } ) 
     
  }

  

}
