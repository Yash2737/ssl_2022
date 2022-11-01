import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef
  showListContainer: boolean = false;
  loginContainer: boolean = true;
  invalidMsg: string = '';
  rows: any[] = [];
  temp: any[] = [];
  fileName = 'SSL_Registerations';
  sabhaOption: any[] = ['Kurla', 'Mulund', 'Badlapur', 'Ghatkopar-East', 'Asalpha', 'Thane', 'Chirag Nagar', 'Vikhroli', 'Sarovdaya']
  sportOption: any[] = [
    'Football',
    'Relay Race',
    'Tug of War',
    'Slow Cycle Race',
    '100 Meter Race',
    'Volley ball',
    'Kho-Kho',
    'Langdi',
    'Laghori',
  ];
  //login ID
  adminArr: any[] = [
    {
      user: 'vaibhav@ssl.com',
      password: 'vaibhav369'
    },
    {
      user: 'yashsoni@ssl.com',
      password: 'yashsoni@369'
    }
  ]

  constructor(private serv: AuthService, private fb: FormBuilder,
    private modalService: NgbModal) { }

  formModel = this.fb.group({
    userID: ['', Validators.required],
    Password: ['', Validators.required],
  });

  get userID() {
    return this.formModel.get('userID');
  }
  ngOnInit(): void {

  }

  onSubmit() {
    for (let i = 0; i < this.adminArr.length; i++) {
      if (this.adminArr[i].user == this.formModel.value.userID) {
        if (this.adminArr[i].password == this.formModel.value.Password) {
          this.serv.getUsers().subscribe((res: any) => {
            res.data.forEach(d => {
              if(d.sequence) {
                d.sslId = 'SSL' + this.pad(d.sequence, 3);
              }
            });
            this.rows = res.data;
            this.temp = res.data;
          }, (err) => {

          })
          this.closeModal.nativeElement.click();
          this.invalidMsg = '';
          this.showListContainer = true;
          this.loginContainer = false;

        } else {
          this.invalidMsg = 'Wrong Password!'
        }
      } else {
        this.invalidMsg = 'Wrong User ID!'
      }
    }
  }

  selectSabha(val: any) {
    if (val == 0) {
      this.rows = this.temp;
    } else {
      const temp = this.temp.filter(x => x.sabha == val);
      this.rows = temp;
    }
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(d => {

      if (val.includes(d))
        return d.name?.toLowerCase().indexOf(val) !== -1 || !val;
      else
        return d.name?.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
  }

  exportexcel() {
    this.fileName += (new Date()).toDateString() + '_' + (new Date()).toLocaleTimeString() + '.xlsx';
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }

}