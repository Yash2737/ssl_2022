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
  currentRole = '';
  currentUser = '';
  modalMsg = '';
  deletePlayer;
  dashboardData;
  gamesDashboard;
  totalRegs = 0;
  totalSpecs = 0;
  sabhaOption: any[] = ['Kurla', 'Mulund', 'Badlapur', 'Ghatkopar-East', 'Asalpha', 'Thane', 'Chirag Nagar', 'Vikhroli', 'Sarvodaya']
  sabhaOptionDisplay: any[] = ['Kurla', 'Mulund', 'Badlapur', 'Ghatkopar-East', 'Asalpha', 'Thane', 'Chirag Nagar', 'Vikhroli', 'Sarvodaya']
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
      password: 'vaibhav369',
      role: 'Admin'
    },
    {
      user: 'yashsoni@ssl.com',
      password: 'yashsoni@369',
      role: 'Admin'
    },
    {
      user: 'asalpha@ssl.com',
      password: 'asalpha@369',
      role: 'Asalpha'
    },
    {
      user: 'kurla@ssl.com',
      password: 'kurla@369',
      role: 'Kurla'
    },
    {
      user: 'mulund@ssl.com',
      password: 'mulund@369',
      role: 'Mulund'
    },
    {
      user: 'badlapur@ssl.com',
      password: 'badlapur@369',
      role: 'Badlapur'
    },
    {
      user: 'east@ssl.com',
      password: 'east@369',
      role: 'Ghatkopar-East'
    },
    {
      user: 'thane@ssl.com',
      password: 'thane@369',
      role: 'Thane'
    },
    {
      user: 'chirag-nagar@ssl.com',
      password: 'chirag-nagar@369',
      role: 'Chirag Nagar'
    },
    {
      user: 'sarvodaya@ssl.com',
      password: 'sarvodaya@369',
      role: 'Sarvodaya'
    },
    {
      user: 'vikhroli@ssl.com',
      password: 'vikhroli@369',
      role: 'Vikhroli'
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
          this.currentRole = this.adminArr[i].role;
          this.currentUser = this.adminArr[i].user;
          if (this.currentRole == 'Admin') {
            this.sabhaOptionDisplay = this.sabhaOption.filter(s => s);
          } else {
            this.sabhaOptionDisplay = this.sabhaOption.filter(s => s == this.currentRole);
          }

          this.getPlayersData();

        } else {
          this.invalidMsg = 'Wrong Password!'
        }
      } else {
        this.invalidMsg = 'Wrong User ID!'
      }
    }
  }

  getPlayersData() {
    this.serv.getUsers().subscribe((res: any) => {
      res.data.forEach(d => {
        if (d.sequence) {
          d.sslId = 'SSL' + this.pad(d.sequence, 3);
        }
      });
      this.rows = res.data;
      this.temp = res.data;
      if (this.currentRole !== 'Admin') {
        this.selectSabha(this.currentRole)
      }
      this.getDashboardData();
    }, (err) => {
      let mockJSON=[{
        sslId:1,
        firstName:'harsh',
        sabha:'ghat east',
        emailId:'h@gmail.com',
        mobileNo:9988888888,
        memberType:'not sure',
        sports:[
          'Football',
          'Relay Race',
          'Tug of War',
          'Slow Cycle Race',
          'Volley ball',          
          'Langdi',
          'Laghori',
        ],
        sevaReceived:'No'
      }]

      this.rows = mockJSON;
    })
    this.closeModal.nativeElement.click();
    this.invalidMsg = '';
    this.showListContainer = true;
    this.loginContainer = false;
  }

  getDashboardData() {
    this.serv.getDash().subscribe((res: any) => {
      this.dashboardData = res.data.regs;
      this.gamesDashboard = res.data.games;
      this.dashboardData.forEach(d => {
        switch (d._id) {
          case 'Ghatkopar-East':
          case 'Asalpha':
            d.target = 175;
            break;
          case 'Kurla':
          case 'Mulund':
          case 'Vikhroli':
          case 'Thane':
            d.target = 60;
            break;
          case 'Badlapur':
            d.target = 70;
            break;
          case 'Chirag Nagar':
            d.target = 110;
            break;
          case 'Sarvodaya':
            d.target = 120;
            break;
        }
      });
      this.totalRegs = this.dashboardData.reduce((n, { countPlayer }) => n + countPlayer, 0)
      this.totalSpecs = this.dashboardData.reduce((n, { countSpectator }) => n + countSpectator, 0)
      if (this.currentRole !== 'Admin') {
        this.selectSabha(this.currentRole)
      }
    }, (err) => {

    })
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
        return d.firstName?.toLowerCase().indexOf(val) !== -1 || !val;
      else
        return d.firstName?.toLowerCase().indexOf(val) !== -1 || !val;
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

  deleteUser(player, deleteModal, msgModal) {
    this.deletePlayer = player;
    this.modalService.open(deleteModal, { centered: true }).result.then(
      (result) => {
        if (result === 'delete') {
          console.log(`Closed with: ${result}`);
          this.removePlayer(player._id, msgModal);
        }
      },
      (reason) => {
        console.log(`Dismissed ${reason}`);
      },
    );
  }

  removePlayer(id, msgModal) {
    this.serv.removePlayer(id).subscribe(
      res => {
        this.modalMsg = 'Player Deleted successfully';
        this.modalService.open(msgModal, { scrollable: true, size: 'md', windowClass: 'customModal-xl' });
        setTimeout(() => {
          this.modalService.dismissAll();
          this.modalMsg = "";
        }, 2500);
        this.getPlayersData();
      },
      err => {
        if (err.error && err.error.message) {
          this.modalMsg = err.error.message;
        }
        else {
          this.modalMsg = 'Server error, please try again';
        }
        this.modalService.open(msgModal, { scrollable: true, size: 'md', windowClass: 'customModal-xl' });
        setTimeout(() => {
          this.modalService.dismissAll();
          this.modalMsg = "";
        }, 2500);
      })
  }

  onSevaReceivedChange(event)
  {
    console.log(event?.target?.value,"onSevaReceivedChange")
    //uncomment for API call
    // this.serv.updateSevaReceived(event?.target?.value).subscribe((response:any)=>{
    //   console.log(response)
    // })

  }

}
