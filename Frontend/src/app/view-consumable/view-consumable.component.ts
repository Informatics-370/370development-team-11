import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Consumable } from '../Shared/Consumable';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteConsumableComponent } from '../delete-consumable/delete-consumable.component';
import { Router } from '@angular/router';
import { UpdateConsumableStockComponent } from '../update-consumable-stock/update-consumable-stock.component';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { ConsumableIFrameComponent } from '../HelpIFrames/ConsumableIFrame/consumable-iframe/consumable-iframe.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-consumable',
  templateUrl: './view-consumable.component.html',
  styleUrls: ['./view-consumable.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})


export class ViewConsumableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  Consumables: Consumable[] = [];
  SearchedConsumables: Consumable[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'On Hand', 'Minimum Reorder Quantity', 'Maximum Reorder Quantity', 'Category', 'action', 'update', 'delete'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';
  dataSource: any;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  openDialog(name: string, ID: Number) {
    console.log(name)
    this.Dialog.open(UpdateConsumableStockComponent, {
      data: { name, ID },
      disableClose: true
    });

    this.Dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }

  ExportInventoryDetails() {
    let docDefinition = {
      content: [
        {
          text: 'Consumable Inventory Details Report',
          fontSize: 16,
          alignment: 'center',
          color: '#244688',
          bold: true
        },
        {
          text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: '#94CC5B'
        },
        {
          text: 'Details Per Consumable Item',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [{ text: 'Name', fillColor: '#244688', color: "white" },
              { text: 'Category', fillColor: '#244688', color: "white" },
              { text: 'Minimum Reorder- Quantity', fillColor: '#244688', color: "white" },
              { text: 'Maximum Reorder- Quantity', fillColor: '#244688', color: "white" },
              { text: 'On-Hand', fillColor: '#244688', color: "white" }],
              ...this.Consumables.map(p => ([p.name, p.consumable_Category.name, p.minimum_Reorder_Quantity, p.maximum_Reorder_Quantity, p.on_Hand]))
            ],
            // Add space after the table
            margin: [0, 10]
          }
        },
        {
          canvas: [
            // Centered line with space above
            { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
          ],
          // Add space above the line
          margin: [0, 10]
        },
        {
          text: '**End of Report**',
          alignment: 'center',
          italics: true,
          margin: [0, 10]
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };
    this.log.action = "Exported Inventory Details";
    this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
    let test: any
    test = new DatePipe('en-ZA');
    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
    this.dataService.AuditLogAdd(this.log).subscribe({
      next: (Log) => {
        pdfMake.createPdf(docDefinition).open();
      }
    })

  }

  OnInPutChange() {
    const Searchterm = this.searchWord.toLocaleLowerCase();

    if (Searchterm) {
      this.dataSource = this.Consumables.filter(consumable => consumable.name.toLocaleLowerCase().includes(Searchterm))
    }
    else if (Searchterm == "") {
      this.GetConsumables();
    }
  }

  ngOnInit() {
    this.GetConsumables();
    console.log(this.Consumables)

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
  }

  GetConsumables() {
    this.dataService.GetConsumables().subscribe(result => {
      let consumableList: any[] = result;
      this.Consumables = [...consumableList];
      this.SearchedConsumables = [...consumableList];
      this.dataSource = new MatTableDataSource(this.Consumables.filter((value, index, self) => self.map(x => x.consumable_ID).indexOf(value.consumable_ID) == index));
      this.dataSource.paginator = this.paginator
      if (result) {
        hideloader();
      }

    });

    function hideloader() {
      document.getElementById('loading').style.display = "none";
      document.getElementById('table').style.visibility = "visible";
    }
  }

  hoveredButton: number | null = null;


  DeleteConsumable(ID: Number) {
    const confirm = this.Dialog.open(DeleteConsumableComponent, {
      disableClose: true,
      data: { ID }
    });

    this.Dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }




  openConsumableIFrameTab(): void {
    const dialogRef = this.Dialog.open(ConsumableIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
